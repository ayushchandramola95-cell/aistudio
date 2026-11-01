from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from services.api.src.models.model_registry import ModelRegistry

INITIAL_MODELS = [
    {
        "id": "nano-banana-2-1",
        "display_name": "Nano Banana 2.1",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-nano-banana-2.1",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "multi-reference", "4k-editing", "web-grounding"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3.1 Flash Image",
            "primary_job": "Mainstream Gen & Edit",
            "prompt_limit": "Up to 1,000,000 tokens",
            "max_resolution": "Up to 4096x4096 (4K)",
            "resolutions": ["512", "1024", "2048", "4096"],
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4", "4:1", "1:4", "8:1", "1:8"],
            "max_reference_images": 14,
            "web_grounding": True,
            "batch_max": 1,
            "synthid": True,
            "features": [
                "Stronger prompt adherence & multi-reference consistency",
                "Up to 14 multi-reference input images",
                "Production quality image generation and edits from 1K to 4K",
                "Real-time Web Search Grounding"
            ],
            "description": "Our upgraded mainstream Gemini image model with stronger prompt adherence, and multi-reference consistency, enabling production quality image generation and edits from 1K to 4K."
        },
        "base_credit_cost": 6.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "nano-banana-2-lite",
        "display_name": "Nano Banana 2 Lite",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-3.1-flash-lite-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "rapid-iteration", "high-volume"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3.1 Flash Lite Image",
            "primary_job": "Rapid iteration & drafts",
            "prompt_limit": "Up to 1,000,000 tokens",
            "max_resolution": "1024x1024 (1K)",
            "resolutions": ["512", "1024"],
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "fast_mode_toggle": True,
            "batch_max": 1,
            "synthid": True,
            "features": [
                "Class leading image generation capabilities",
                "Optimized for high-volume, latency-sensitive asset creation",
                "512px and 1024px rapid draft rendering"
            ],
            "description": "Class leading image generation capabilities, now optimized for high-volume, latency-sensitive asset creation."
        },
        "base_credit_cost": 3.0,
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
        "supported_tasks": ["text-to-image", "thinking-reasoning", "multilingual-typography", "4k-studio"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3 Pro Image",
            "primary_job": "Complex layouts & typography",
            "prompt_limit": "Up to 1,000,000 tokens",
            "max_resolution": "Up to 4096x4096 (4K)",
            "resolutions": ["1024", "2048", "4096"],
            "aspect_ratios": ["1:1", "3:4", "4:3", "9:16", "16:9", "4:1", "1:4", "8:1", "1:8"],
            "max_references": 10,
            "thinking_budget": True,
            "text_quotation_guide": True,
            "batch_max": 2,
            "synthid": True,
            "features": [
                "Internal Thinking Process before rendering",
                "Multilingual embedded crisp typography",
                "Complex infographics & brand-accurate spatial composition",
                "Studio 4K resolution output"
            ],
            "description": "A powerful image generation model that combines high quality graphics, text rendering in multiple languages, and world knowledge"
        },
        "base_credit_cost": 10.0,
        "cost_multiplier_rules": {
            "resolution": {"1024": 10.0, "2048": 14.0, "4096": 20.0},
            "deep_thinking": 2.0,
            "aspect_ratio": 1.0,
            "batch": 1.0
        },
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "nano-banana-2",
        "display_name": "Nano Banana 2",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-3.1-flash-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "editing", "general-generation", "multi-character"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3.1 Flash Image",
            "primary_job": "General-purpose predecessor to 2.1",
            "prompt_limit": "Up to 1,000,000 tokens",
            "max_resolution": "Up to 4096x4096 (4K)",
            "resolutions": ["512", "1024", "2048", "4096"],
            "aspect_ratios": ["1:1", "16:9", "4:3", "3:2", "5:4", "9:16", "3:4", "2:3", "4:5", "21:9", "4:1", "1:4", "8:1", "1:8"],
            "max_references": 14,
            "character_consistency": "Up to 5 characters & 14 objects",
            "batch_max": 4,
            "synthid": True,
            "features": [
                "Multi-character consistency (up to 5 characters & 14 objects)",
                "General image generation and editing tasks",
                "Balanced high quality and low latency"
            ],
            "description": "gemini-3.1-flash-image is a model designed for general image generation and editing tasks, offering high quality and low latency."
        },
        "base_credit_cost": 5.0,
        "cost_multiplier_rules": {
            "resolution": {"512": 3.0, "1024": 5.0, "2048": 8.0, "4096": 15.0},
            "aspect_ratio": 1.0,
            "batch": 1.0
        },
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "nano-banana",
        "display_name": "Nano Banana",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-2.5-flash-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "legacy-flash"],
        "parameter_schema": {
            "underlying_engine": "Gemini 2.5 Flash Image",
            "primary_job": "Legacy Flash image generation",
            "prompt_limit": "~128,000 to 1,000,000 tokens",
            "max_resolution": "Native 1K (1024x1024)",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9"],
            "batch_max": 1,
            "synthid": True,
            "features": [
                "State-of-the-art native multimodal image generation",
                "Native 1K resolution baseline",
                "Direct prompt synthesis"
            ],
            "description": "gemini-2.5-flash-image. State-of-the-art image generation and editing model."
        },
        "base_credit_cost": 4.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-4-fast",
        "display_name": "Imagen 4 Fast",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "imagen-4.0-fast",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "diffusion", "batch-parallel"],
        "parameter_schema": {
            "underlying_engine": "Imagen 4 Fast",
            "primary_job": "Rapid pure text-to-photo",
            "prompt_limit": "Traditional text prompt (~480–1,000 chars)",
            "max_resolution": "~1408x768 (approx. 1 MP)",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "batch_max": 4,
            "person_generation_filter": ["allow_all", "dont_allow", "allow_adult"],
            "synthid": True,
            "features": [
                "Sub-3-second diffusion generation",
                "Parallel batch sampling (1 to 4 images)",
                "Person generation safety filters",
                "5 supported diffusion aspect ratios"
            ],
            "description": "Fast image generation with text prompts."
        },
        "base_credit_cost": 4.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "virtual-try-on",
        "display_name": "Virtual try-on",
        "provider": "google-cloud",
        "family": "specialized",
        "version": "virtual-try-on-v1",
        "backend_type": "hosted_api",
        "supported_tasks": ["virtual-try-on", "fashion-editing", "product-mockups"],
        "parameter_schema": {
            "underlying_engine": "Google Virtual Try-On",
            "primary_job": "Garment transfer",
            "input_mode": "dual-image",
            "prompt_limit": "Optional text hint (e.g. fit description)",
            "max_resolution": "1024px / Portrait (3:4, 9:16)",
            "aspect_ratios": ["1:1", "3:4", "9:16"],
            "categories": ["Tops", "Bottoms", "Dresses", "Outerwear"],
            "batch_max": 1,
            "synthid": True,
            "features": [
                "Dual image dropzones (Person photo + Garment photo)",
                "Realistic fabric drape & body shape adaptation",
                "Apparel category specialization (Tops, Bottoms, Dresses)"
            ],
            "description": "Specialized model to generate images of people trying on clothing."
        },
        "base_credit_cost": 8.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-3-capability-001",
        "display_name": "Imagen 3 Capability 001",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "imagen-3.0-capability-001",
        "backend_type": "hosted_api",
        "supported_tasks": ["image-editing", "inpainting", "outpainting", "background-swap"],
        "parameter_schema": {
            "underlying_engine": "Imagen 3 Capability 001",
            "primary_job": "Mask-based inpainting",
            "input_mode": "base-image-plus-mask",
            "prompt_limit": "Short descriptive text prompt with base image & edit mask",
            "max_resolution": "1024x1024 (Native 1K)",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"],
            "modes": ["inpainting", "outpainting", "background-swap"],
            "batch_max": 4,
            "synthid": True,
            "features": [
                "Targeted inpainting with visual brush mask editor",
                "Outpainting boundary expansion",
                "Background replacement mode",
                "Native 1K precision editing"
            ],
            "description": "Fast image editing."
        },
        "base_credit_cost": 5.0,
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

        # 1. Remove models not in this exact Google catalog
        await session.execute(
            delete(ModelRegistry).where(ModelRegistry.id.not_in(allowed_ids))
        )

        # 2. Upsert each approved Google model
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
