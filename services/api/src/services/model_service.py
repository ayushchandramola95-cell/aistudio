from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.src.models.model_registry import ModelRegistry

INITIAL_MODELS = [
    {
        "id": "imagen-3",
        "display_name": "Google Imagen 3 (High Quality)",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "3.0-generate-002",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "image-to-image"],
        "parameter_schema": {
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "sample_count": [1, 2, 4],
            "person_generation": ["allow_adult", "dont_allow"],
            "safety_filter_level": ["block_medium_and_above", "block_low_and_above", "block_none"]
        },
        "base_credit_cost": 8.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-3-fast",
        "display_name": "Google Imagen 3 Fast",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "3.0-fast-generate-001",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image"],
        "parameter_schema": {
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"],
            "sample_count": [1, 2],
            "person_generation": ["allow_adult", "dont_allow"]
        },
        "base_credit_cost": 4.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-3-edit",
        "display_name": "Google Imagen 3 Inpainting & Edit",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "3.0-generate-002",
        "backend_type": "hosted_api",
        "supported_tasks": ["image-to-image", "inpainting"],
        "parameter_schema": {
            "requires_mask": True,
            "aspect_ratios": ["1:1", "16:9", "9:16"]
        },
        "base_credit_cost": 10.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "imagen-3-upscale",
        "display_name": "Google Imagen 4K Upscaler",
        "provider": "google-cloud",
        "family": "imagen",
        "version": "3.0-upscale",
        "backend_type": "hosted_api",
        "supported_tasks": ["image-upscaling"],
        "parameter_schema": {
            "upscale_factor": ["2x", "4x"]
        },
        "base_credit_cost": 4.0,
        "cost_multiplier_rules": {"4x": 2.0},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "flux-1-schnell",
        "display_name": "FLUX.1 Schnell",
        "provider": "black-forest-labs",
        "family": "flux",
        "version": "1.0",
        "backend_type": "gpu_worker",
        "supported_tasks": ["text-to-image"],
        "parameter_schema": {
            "steps": {"min": 4, "max": 12, "default": 4},
            "guidance_scale": {"min": 1.0, "max": 7.0, "default": 3.5},
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"]
        },
        "base_credit_cost": 6.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": 16.0,
        "status": "active",
        "commercial_license": "apache-2.0",
        "is_approved_for_paid": True
    },
    {
        "id": "flux-1-dev",
        "display_name": "FLUX.1 Dev",
        "provider": "black-forest-labs",
        "family": "flux",
        "version": "1.0",
        "backend_type": "gpu_worker",
        "supported_tasks": ["text-to-image"],
        "parameter_schema": {
            "steps": {"min": 20, "max": 50, "default": 28},
            "guidance_scale": {"min": 1.0, "max": 12.0, "default": 4.5},
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"]
        },
        "base_credit_cost": 10.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": 24.0,
        "status": "active",
        "commercial_license": "bfl-non-commercial-api",
        "is_approved_for_paid": True
    },
    {
        "id": "sd-3-5",
        "display_name": "Stable Diffusion 3.5 Large",
        "provider": "stability-ai",
        "family": "sd3",
        "version": "3.5",
        "backend_type": "gpu_worker",
        "supported_tasks": ["text-to-image"],
        "parameter_schema": {
            "steps": {"min": 20, "max": 40, "default": 25},
            "guidance_scale": {"min": 1.0, "max": 10.0, "default": 4.5},
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"]
        },
        "base_credit_cost": 5.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": 16.0,
        "status": "active",
        "commercial_license": "stability-community",
        "is_approved_for_paid": True
    },
    {
        "id": "gemini-2-flash",
        "display_name": "Google Gemini 2.0 Flash",
        "provider": "google-cloud",
        "family": "gemini",
        "version": "2.0-flash",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-generation", "prompt-enhancement", "multimodal"],
        "parameter_schema": {
            "temperature": {"min": 0.0, "max": 2.0, "default": 0.7},
            "max_tokens": {"min": 100, "max": 8192, "default": 2048}
        },
        "base_credit_cost": 1.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "veo-2",
        "display_name": "Google Veo 2",
        "provider": "google-cloud",
        "family": "veo",
        "version": "2.0",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-video", "image-to-video"],
        "parameter_schema": {
            "duration_seconds": [3, 5, 8],
            "aspect_ratios": ["16:9", "9:16"],
            "resolution": ["720p", "1080p"]
        },
        "base_credit_cost": 80.0,
        "cost_multiplier_rules": {"1080p": 1.5, "duration_8s": 1.6},
        "min_vram_gb": None,
        "status": "active",
        "commercial_license": "google-cloud-commercial",
        "is_approved_for_paid": True
    },
    {
        "id": "kokoro-tts",
        "display_name": "Kokoro TTS",
        "provider": "open-source",
        "family": "kokoro",
        "version": "0.19",
        "backend_type": "gpu_worker",
        "supported_tasks": ["text-to-speech"],
        "parameter_schema": {
            "voices": ["af_bella", "af_sarah", "am_adam", "am_michael", "bf_emma"],
            "speed": {"min": 0.5, "max": 2.0, "default": 1.0}
        },
        "base_credit_cost": 2.0,
        "cost_multiplier_rules": {},
        "min_vram_gb": 4.0,
        "status": "active",
        "commercial_license": "apache-2.0",
        "is_approved_for_paid": True
    }
]

class ModelService:
    @staticmethod
    async def seed_initial_models(session: AsyncSession):
        for model_data in INITIAL_MODELS:
            existing = await session.execute(
                select(ModelRegistry).where(ModelRegistry.id == model_data["id"])
            )
            if not existing.scalar_one_or_none():
                model_entry = ModelRegistry(**model_data)
                session.add(model_entry)
        await session.commit()

    @staticmethod
    async def list_models(session: AsyncSession) -> list[ModelRegistry]:
        query = select(ModelRegistry).where(ModelRegistry.status != "disabled")
        result = await session.execute(query)
        return list(result.scalars().all())
