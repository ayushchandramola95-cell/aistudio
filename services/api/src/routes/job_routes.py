import uuid
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from services.api.src.config import settings
from services.api.src.database import get_db
from services.api.src.models.user import User
from services.api.src.models.job import GenerationJob, JobOutput
from services.api.src.models.model_registry import ModelRegistry
from services.api.src.services.credit_service import CreditService
from services.api.src.services.image_service import ImageService
from services.api.src.routes.auth_routes import get_current_user
from services.api.src.schemas.job import JobCreateRequest, JobResponse, JobOutputResponse, EnhancePromptRequest, EnhancePromptResponse

router = APIRouter(prefix="/api/v1/jobs", tags=["Generation Jobs"])

def _enrich_outputs(outputs: list[JobOutput]) -> list[JobOutputResponse]:
    enriched = []
    for o in outputs:
        resp = JobOutputResponse.model_validate(o)
        if o.file_key.startswith("/"):
            resp.download_url = f"{settings.API_BASE_URL}{o.file_key}"
        else:
            resp.download_url = o.file_key
        enriched.append(resp)
    return enriched

@router.post("", response_model=JobResponse, status_code=202)
async def submit_job(
    payload: JobCreateRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    # 1. Verify model availability
    result = await session.execute(
        select(ModelRegistry).where(ModelRegistry.id == payload.model_id)
    )
    model = result.scalar_one_or_none()
    if not model or model.status != "active":
        raise HTTPException(status_code=400, detail=f"Model '{payload.model_id}' is currently unavailable.")

    # 2. Calculate required credits
    credits_needed = float(model.base_credit_cost)
    batch_count = payload.parameters.get("sample_count", 1)
    if isinstance(batch_count, int) and batch_count > 1:
        credits_needed *= batch_count

    job_id = str(uuid.uuid4())
    idempotency_key = f"job-res-{job_id}"

    # 3. Reserve credits atomically via Two-Phase Escrow
    await CreditService.reserve_credits(
        session=session,
        user_id=current_user.id,
        amount=credits_needed,
        idempotency_key=idempotency_key,
        job_id=job_id,
        reason=f"Reservation for {model.display_name} generation"
    )

    # 4. Create Job Record
    job = GenerationJob(
        id=job_id,
        user_id=current_user.id,
        model_id=payload.model_id,
        task_type=payload.task_type,
        raw_prompt=payload.raw_prompt,
        enhanced_prompt=None,
        parameters=payload.parameters,
        status="QUEUED",
        progress=0,
        credits_reserved=credits_needed,
        credits_charged=0.0
    )
    session.add(job)
    await session.commit()

    # 5. Dispatch async processing pipeline
    if payload.task_type in ("image_generation", "text-to-image", "image-to-image", "inpainting", "outpainting"):
        background_tasks.add_task(ImageService.process_job_async, job_id)
    
    # Reload with outputs eagerly loaded
    query = (
        select(GenerationJob)
        .options(selectinload(GenerationJob.outputs))
        .where(GenerationJob.id == job_id)
    )
    res = await session.execute(query)
    job_loaded = res.scalar_one()

    resp = JobResponse.model_validate(job_loaded)
    resp.outputs = _enrich_outputs(job_loaded.outputs)
    return resp

@router.get("", response_model=list[JobResponse])
async def list_jobs(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
    limit: int = 20
):
    query = (
        select(GenerationJob)
        .options(selectinload(GenerationJob.outputs))
        .where(GenerationJob.user_id == current_user.id)
        .order_by(desc(GenerationJob.created_at))
        .limit(limit)
    )
    result = await session.execute(query)
    jobs = result.scalars().all()
    
    resp_list = []
    for job in jobs:
        resp = JobResponse.model_validate(job)
        resp.outputs = _enrich_outputs(job.outputs)
        resp_list.append(resp)
    return resp_list

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    query = (
        select(GenerationJob)
        .options(selectinload(GenerationJob.outputs))
        .where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id)
    )
    result = await session.execute(query)
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resp = JobResponse.model_validate(job)
    resp.outputs = _enrich_outputs(job.outputs)
    return resp

@router.post("/enhance-prompt", response_model=EnhancePromptResponse)
async def enhance_prompt(payload: EnhancePromptRequest):
    """Enriches a user's prompt using Gemini LLM or aesthetic heuristic enhancer."""
    raw = payload.prompt.strip()
    if not raw:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    enhanced = ""
    suggested_model = "nano-banana-2-1"

    # Intelligent model recommendation heuristics
    lower_raw = raw.lower()
    if any(k in lower_raw for k in ["text", "quote", "signage", "typography", "logo", "words", "chart", "diagram"]):
        suggested_model = "nano-banana-pro"
    elif any(k in lower_raw for k in ["rapid", "draft", "fast", "speed", "quick", "sketch"]):
        suggested_model = "imagen-4-fast"
    elif any(k in lower_raw for k in ["dress", "shirt", "outfit", "wearing", "garment", "suit", "jacket", "fashion model"]):
        suggested_model = "virtual-try-on"
    elif any(k in lower_raw for k in ["inpaint", "mask", "replace background", "outpaint", "remove background"]):
        suggested_model = "imagen-3-capability-001"
    else:
        suggested_model = "nano-banana-2-1"

    # Try live Gemini LLM expansion
    client = ImageService.get_genai_client()
    if client is not None:
        try:
            import asyncio
            style_instruction = f" Incorporate the requested visual style: '{payload.style}'." if payload.style else ""
            prompt_instruction = (
                f"You are a master AI image prompt enhancer. Transform the following basic prompt into an exceptional, "
                f"vivid, cinematic image generation prompt. Include precise lighting (e.g. volumetric rays, golden hour, neon rim light), "
                f"camera parameters (e.g. 35mm lens, f/1.8, shallow depth of field), rich textures, atmospheric depth, and artistic style.{style_instruction} "
                f"Keep it under 75 words. Do not include markdown or prefix quotes, return ONLY the raw enhanced prompt.\n\n"
                f"Original Prompt: {raw}"
            )
            response = await asyncio.to_thread(
                client.models.generate_content,
                model="gemini-2.5-flash-image",
                contents=prompt_instruction,
            )
            if response and response.text:
                enhanced = response.text.strip().replace('"', '').replace('**', '')
        except Exception:
            # Fall back to algorithmic enhancer if Gemini LLM times out or fails
            enhanced = ""

    # Algorithmic aesthetic enhancer fallback
    if not enhanced:
        descriptors = [
            "ultra-high-definition 8K resolution",
            "volumetric cinematic lighting with soft diffused shadows",
            "shot on 35mm anamorphic lens with gentle shallow depth of field",
            "intricate hyper-detailed surface textures and subtle color grading",
            "award-winning composition, atmospheric mist and fine micro-details"
        ]
        
        style_suffix = ""
        if payload.style:
            style_suffix = f", styled in authentic {payload.style} aesthetic"
        elif "photoreal" not in lower_raw and "anime" not in lower_raw and "art" not in lower_raw:
            style_suffix = ", photorealistic studio photography"

        # Combine cleanly
        enhanced = f"{raw}{style_suffix}, {', '.join(descriptors[:3])}"

    return EnhancePromptResponse(
        original_prompt=raw,
        enhanced_prompt=enhanced,
        style_applied=payload.style,
        suggested_model=suggested_model
    )
