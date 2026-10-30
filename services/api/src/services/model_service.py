from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from services.api.src.models.model_registry import ModelRegistry

INITIAL_MODELS = [
    {
        "id": "nano-banana-2",
        "display_name": "Nano Banana 2",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-3.1-flash-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "multi-character", "storyboarding", "web-grounded"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3.1 Flash Image",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "max_prompt_words": "~1,000+ words",
            "multi_character_limit": 5,
            "objects_limit": 14,
            "web_search_grounding": True,
            "synthid_watermark": True,
            "features": [
                "Multi-character consistency (up to 5 characters & 14 objects)",
                "Real-time Web Search grounding",
                "Exceptional text-in-image rendering"
            ],
            "best_use_cases": "Interactive & Storytelling Apps: Ideal for generating storyboards, custom comic books, or mockups where characters must remain identical across multiple scenes. Uses real-time search to match current events/niche real-world objects."
        },
        "base_credit_cost": 5.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "nano-banana-pro",
        "display_name": "Nano Banana Pro",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-3-pro-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "inpainting", "outpainting", "complex-reasoning"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3 Pro Image",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "max_prompt_words": "~1,000+ words",
            "advanced_editing": ["inpainting", "outpainting"],
            "synthid_watermark": True,
            "features": [
                "Complex prompt reasoning",
                "Professional-grade visual quality",
                "Advanced editing (inpainting & outpainting)"
            ],
            "best_use_cases": "Studio & Marketing Production: High-end graphic design, complex infographics, educational diagrams, and promotional materials that require precise, stylized rendering and custom editing (adjusting lighting, camera angles, color grading)."
        },
        "base_credit_cost": 10.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-3",
        "display_name": "Imagen 3",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "imagen-3.0-generate-002",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "image-to-image"],
        "parameter_schema": {
            "underlying_engine": "imagen-3.0-generate-002",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "max_prompt_words": "~250 - 500 words",
            "sample_count": [1, 2, 4],
            "synthid_watermark": True,
            "features": [
                "Exceptional photorealism",
                "High prompt adherence",
                "Crisp, legible text rendering"
            ],
            "best_use_cases": "General Photorealism & High-Quality Design: Best for creating beautiful, realistic artwork, professional product shots, and high-fidelity text-heavy images."
        },
        "base_credit_cost": 8.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-2",
        "display_name": "Imagen 2",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "imagegeneration@006",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "outpainting", "inpainting"],
        "parameter_schema": {
            "underlying_engine": "imagegeneration@006",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"],
            "max_prompt_words": "~250 words",
            "synthid_watermark": True,
            "features": [
                "Reliable baseline text-to-image",
                "Image expansion (outpainting)",
                "Subject editing (inpainting)"
            ],
            "best_use_cases": "Legacy Applications & High-Volume Tasks: Great for cost-effective standard generation, bulk image assets, and standard image editing tasks like placing product mockups in different environments."
        },
        "base_credit_cost": 4.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    }
]

class ModelService:
    @staticmethod
    async def seed_initial_models(session: AsyncSession):
        allowed_ids = {m["id"] for m in INITIAL_MODELS}

        # 1. Purge / remove any legacy models not in the approved Vertex AI set
        await session.execute(
            delete(ModelRegistry).where(ModelRegistry.id.not_in(allowed_ids))
        )

        # 2. Upsert each approved model
        for model_data in INITIAL_MODELS:
            existing = await session.execute(
                select(ModelRegistry).where(ModelRegistry.id == model_data["id"])
            )
            model_entry = existing.scalar_one_or_none()
            if not model_entry:
                session.add(ModelRegistry(**model_data))
            else:
                for k, v in model_data.items():
                    setattr(model_entry, k, v)

        await session.commit()

    @staticmethod
    async def list_models(session: AsyncSession) -> list[ModelRegistry]:
        allowed_ids = {m["id"] for m in INITIAL_MODELS}
        query = select(ModelRegistry).where(
            ModelRegistry.id.in_(allowed_ids),
            ModelRegistry.status != "disabled"
        )
        result = await session.execute(query)
        return list(result.scalars().all())
