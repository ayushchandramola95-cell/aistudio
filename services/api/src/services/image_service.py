import os
import io
import asyncio
import uuid
import logging
from datetime import datetime, timezone
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from services.api.src.config import settings
from services.api.src.database import AsyncSessionLocal
from services.api.src.models.job import GenerationJob, JobOutput
from services.api.src.services.credit_service import CreditService

logger = logging.getLogger("aistudio.image_service")

# Ensure storage directory exists
OUTPUT_DIR = Path(settings.STORAGE_DIR) / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SUPPORTED_ASPECT_RATIOS = {"1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "4:1", "1:4", "8:1", "1:8"}

class ImageService:
    @staticmethod
    def get_genai_client():
        """Initializes Google GenAI Client with either Vertex AI (for GCP Cloud Credits) or Gemini API key."""
        project = settings.GOOGLE_CLOUD_PROJECT or os.environ.get("GOOGLE_CLOUD_PROJECT")
        api_key = (
            settings.GEMINI_API_KEY
            or settings.GOOGLE_GENAI_API_KEY
            or os.environ.get("GEMINI_API_KEY")
            or os.environ.get("GOOGLE_GENAI_API_KEY")
        )

        try:
            from google import genai
            from google.oauth2 import service_account

            cred_path = (
                settings.GOOGLE_APPLICATION_CREDENTIALS 
                or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
            )
            if not cred_path and os.path.exists("gcp-key.json"):
                cred_path = os.path.abspath("gcp-key.json")

            creds = None
            if cred_path and os.path.exists(cred_path):
                scopes = ["https://www.googleapis.com/auth/cloud-platform"]
                creds = service_account.Credentials.from_service_account_file(cred_path, scopes=scopes)

            # 1. Vertex AI Mode: Uses Google Cloud Free Credits ($200/$300)
            # Active when VERTEX_AI=true, creds are provided, or running inside Google Cloud Run
            if settings.VERTEX_AI or creds is not None or (project and os.environ.get("K_SERVICE")):
                client_kwargs = {
                    "vertexai": True,
                    "project": project,
                    "location": settings.GOOGLE_CLOUD_REGION,
                }
                if creds is not None:
                    client_kwargs["credentials"] = creds
                return genai.Client(**client_kwargs)

            # 2. Direct API Key (Google AI Studio)
            if api_key and not api_key.startswith("test"):
                return genai.Client(api_key=api_key)

            # 3. Fallback to Vertex AI if project is specified
            if project:
                return genai.Client(
                    vertexai=True,
                    project=project,
                    location=settings.GOOGLE_CLOUD_REGION,
                )
        except Exception as e:
            logger.warning(f"Google GenAI Client initialization note: {e}")
        return None

    @staticmethod
    async def process_job_async(job_id: str):
        """Background worker task that handles image generation and Two-Phase Escrow."""
        async with AsyncSessionLocal() as session:
            try:
                # 1. Fetch job with outputs
                query = (
                    select(GenerationJob)
                    .options(selectinload(GenerationJob.outputs))
                    .where(GenerationJob.id == job_id)
                )
                res = await session.execute(query)
                job = res.scalar_one_or_none()
                if not job:
                    logger.error(f"Job {job_id} not found for processing")
                    return

                # 2. Update to PROCESSING
                job.status = "PROCESSING"
                job.progress = 25
                job.started_at = datetime.now(timezone.utc)
                await session.commit()

                # 3. Extract parameters
                params = job.parameters or {}
                raw_ratio = params.get("aspect_ratio", "16:9")
                aspect_ratio = raw_ratio if raw_ratio in SUPPORTED_ASPECT_RATIOS else "16:9"
                sample_count = max(1, min(4, int(params.get("sample_count", 1))))
                negative_prompt = params.get("negative_prompt")
                guidance_scale = float(params.get("guidance_scale", 7.0)) if params.get("guidance_scale") else None
                seed = int(params.get("seed")) if params.get("seed") and params.get("seed") != -1 else None
                safety_filter_level = params.get("safety_filter_level")
                person_generation = params.get("person_generation")
                web_search_grounding = bool(params.get("web_search_grounding", False))
                synthid_watermark = bool(params.get("synthid_watermark", True))

                client = ImageService.get_genai_client()
                generated_files: list[str] = []

                # Vertex AI Target Engine Mapping
                ENGINE_MAP = {
                    "nano-banana-2-1": "gemini-3.1-flash-image",
                    "nano-banana-2-lite": "gemini-3.1-flash-lite-image",
                    "nano-banana-pro": "gemini-3-pro-image",
                    "nano-banana-2": "gemini-3.1-flash-image",
                    "nano-banana": "gemini-2.5-flash-image",
                    "imagen-4-fast": "imagen-4.0-fast",
                    "virtual-try-on": "virtual-try-on-v1",
                    "imagen-3-capability-001": "imagen-3.0-capability-001",
                }
                target_engine = ENGINE_MAP.get(job.model_id, "gemini-2.5-flash-image")

                if client is not None:
                    try:
                        from google.genai import types

                        config_kwargs = {
                            "number_of_images": sample_count,
                            "aspect_ratio": aspect_ratio,
                            "output_mime_type": "image/jpeg",
                        }
                        if negative_prompt:
                            config_kwargs["negative_prompt"] = negative_prompt
                        if guidance_scale is not None:
                            config_kwargs["guidance_scale"] = guidance_scale
                        if seed is not None:
                            config_kwargs["seed"] = seed
                        if safety_filter_level:
                            config_kwargs["safety_filter_level"] = safety_filter_level
                        if person_generation:
                            config_kwargs["person_generation"] = person_generation

                        config = types.GenerateImagesConfig(**config_kwargs)

                        # 1. If Imagen series or image generation API:
                        if "imagen" in target_engine or "imagegeneration" in target_engine:
                            try:
                                response = await asyncio.to_thread(
                                    client.models.generate_images,
                                    model=target_engine,
                                    prompt=job.raw_prompt,
                                    config=config,
                                )
                                if response.generated_images:
                                    for idx, gen_img in enumerate(response.generated_images):
                                        filename = f"{job.id}_{idx}.jpg"
                                        filepath = OUTPUT_DIR / filename
                                        with open(filepath, "wb") as f:
                                            f.write(gen_img.image.image_bytes)
                                        generated_files.append(filename)
                            except Exception as img_err:
                                logger.info(f"Target engine {target_engine} fallback to live Vertex AI gemini-2.5-flash-image: {img_err}")
                                try:
                                    content_res = await asyncio.to_thread(
                                        client.models.generate_content,
                                        model="gemini-2.5-flash-image",
                                        contents=job.raw_prompt,
                                    )
                                    if content_res.candidates:
                                        for cand in content_res.candidates:
                                            if cand.content and cand.content.parts:
                                                for idx, part in enumerate(cand.content.parts):
                                                    if part.inline_data and part.inline_data.data:
                                                        ext = "png" if "png" in (part.inline_data.mime_type or "") else "jpg"
                                                        filename = f"{job.id}_{len(generated_files)}.{ext}"
                                                        filepath = OUTPUT_DIR / filename
                                                        with open(filepath, "wb") as f:
                                                            f.write(part.inline_data.data)
                                                        generated_files.append(filename)
                                except Exception as fb_err:
                                    logger.warning(f"Vertex AI gemini-2.5-flash-image fallback note: {fb_err}")

                        # 2. If Gemini Image series (Nano Banana 2.1 / Nano Banana Pro / etc.):
                        else:
                            prompt_text = job.raw_prompt
                            if aspect_ratio and aspect_ratio != "1:1":
                                prompt_text = f"{prompt_text}\nComposition aspect ratio: {aspect_ratio}"
                            if negative_prompt:
                                prompt_text = f"{prompt_text}\nAvoid the following elements: {negative_prompt}"

                            gemini_config = None
                            if web_search_grounding and target_engine != "gemini-2.5-flash-image":
                                try:
                                    gemini_config = types.GenerateContentConfig(
                                        tools=[types.Tool(google_search=types.GoogleSearch())]
                                    )
                                except Exception:
                                    gemini_config = None

                            turns_to_run = max(1, min(4, sample_count))
                            for turn_idx in range(turns_to_run):
                                try:
                                    gen_kwargs = {"model": target_engine, "contents": prompt_text}
                                    if gemini_config:
                                        gen_kwargs["config"] = gemini_config
                                    content_res = await asyncio.to_thread(
                                        client.models.generate_content,
                                        **gen_kwargs,
                                    )
                                    if content_res.candidates:
                                        for cand in content_res.candidates:
                                            if cand.content and cand.content.parts:
                                                for idx, part in enumerate(cand.content.parts):
                                                    if part.inline_data and part.inline_data.data:
                                                        ext = "png" if "png" in (part.inline_data.mime_type or "") else "jpg"
                                                        filename = f"{job.id}_{len(generated_files)}.{ext}"
                                                        filepath = OUTPUT_DIR / filename
                                                        with open(filepath, "wb") as f:
                                                            f.write(part.inline_data.data)
                                                        generated_files.append(filename)
                                except Exception as gem_err:
                                    logger.info(f"Gemini {target_engine} turn {turn_idx} fallback to gemini-2.5-flash-image: {gem_err}")
                                    try:
                                        content_res = await asyncio.to_thread(
                                            client.models.generate_content,
                                            model="gemini-2.5-flash-image",
                                            contents=prompt_text,
                                        )
                                        if content_res.candidates:
                                            for cand in content_res.candidates:
                                                if cand.content and cand.content.parts:
                                                    for idx, part in enumerate(cand.content.parts):
                                                        if part.inline_data and part.inline_data.data:
                                                            ext = "png" if "png" in (part.inline_data.mime_type or "") else "jpg"
                                                            filename = f"{job.id}_{len(generated_files)}.{ext}"
                                                            filepath = OUTPUT_DIR / filename
                                                            with open(filepath, "wb") as f:
                                                                f.write(part.inline_data.data)
                                                            generated_files.append(filename)
                                    except Exception as fb_err:
                                        logger.warning(f"Vertex AI fallback note: {fb_err}")

                    except Exception as gen_err:
                        logger.warning(f"Google Vertex AI generation note: {gen_err}")

                if not generated_files:
                    raise RuntimeError("No image output generated by Google Vertex AI. Please check model parameters or retry.")

                # 4. Save Outputs to Database
                for filename in generated_files:
                    output = JobOutput(
                        id=str(uuid.uuid4()),
                        job_id=job.id,
                        file_key=f"/outputs/{filename}",
                        storage_provider="local",
                        mime_type="image/jpeg",
                        file_size_bytes=(OUTPUT_DIR / filename).stat().st_size if (OUTPUT_DIR / filename).exists() else 0,
                    )
                    session.add(output)

                # 5. Mark Job Completed
                job.status = "COMPLETED"
                job.progress = 100
                job.completed_at = datetime.now(timezone.utc)
                job.credits_charged = float(job.credits_reserved)
                await session.commit()

                # 6. Settle Escrow Credits Permanently
                await CreditService.settle_credits(
                    session=session,
                    user_id=job.user_id,
                    amount=float(job.credits_reserved),
                    idempotency_key=f"settle-{job.id}",
                    job_id=job.id,
                    reason=f"Settlement for {job.model_id} image generation"
                )
                logger.info(f"Job {job.id} completed successfully.")

            except Exception as e:
                logger.error(f"Error processing image job {job_id}: {e}", exc_info=True)
                try:
                    query = select(GenerationJob).where(GenerationJob.id == job_id)
                    res = await session.execute(query)
                    job = res.scalar_one_or_none()
                    if job:
                        job.status = "FAILED"
                        job.error_message = str(e)
                        await session.commit()

                        # Refund reserved credits
                        await CreditService.refund_credits(
                            session=session,
                            user_id=job.user_id,
                            amount=float(job.credits_reserved),
                            idempotency_key=f"refund-{job.id}",
                            job_id=job.id,
                            reason=f"Auto-refund: generation failed"
                        )
                except Exception as refund_err:
                    logger.error(f"Failed to process refund for job {job_id}: {refund_err}")
