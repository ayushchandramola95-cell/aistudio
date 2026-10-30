from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from services.api.src.models.model_registry import ModelRegistry

INITIAL_MODELS = [
    {
        "id": "nano-banana-2-1",
        "display_name": "Nano Banana 2.1",
        "provider": "google-cloud",
        "family": "gemini-image",
        "version": "gemini-3.1-flash-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "multi-reference", "4k-editing"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3.1 Flash Image (Upgraded)",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "resolution": "1K to 4K",
            "features": [
                "Stronger prompt adherence",
                "Multi-reference consistency",
                "Production quality image generation and edits from 1K to 4K"
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
        "version": "gemini-2.5-flash-image",
        "backend_type": "hosted_api",
        "supported_tasks": ["text-to-image", "high-volume", "low-latency"],
        "parameter_schema": {
            "underlying_engine": "Gemini 2.5 Flash Image (Optimized)",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"],
            "features": [
                "Class leading image generation capabilities",
                "Optimized for high-volume creation",
                "Ultra-low latency asset generation"
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
        "supported_tasks": ["text-to-image", "world-knowledge", "multilingual-text"],
        "parameter_schema": {
            "underlying_engine": "Gemini 3 Pro Image",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "features": [
                "High quality graphics & reasoning",
                "Text rendering in multiple languages",
                "Deep world knowledge"
            ],
            "description": "A powerful image generation model that combines high quality graphics, text rendering in multiple languages, and world knowledge."
        },
        "base_credit_cost": 10.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
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
        "supported_tasks": ["text-to-image", "editing", "general-generation"],
        "parameter_schema": {
            "underlying_engine": "gemini-3.1-flash-image",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "features": [
                "General image generation and editing tasks",
                "High visual quality",
                "Low latency response"
            ],
            "description": "gemini-3.1-flash-image is a model designed for general image generation and editing tasks, offering high quality and low latency."
        },
        "base_credit_cost": 5.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0, "batch": 1.0},
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
        "supported_tasks": ["text-to-image", "editing"],
        "parameter_schema": {
            "underlying_engine": "gemini-2.5-flash-image",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "features": [
                "State-of-the-art image generation",
                "Advanced image editing",
                "Native multimodal architecture"
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
        "supported_tasks": ["text-to-image", "rapid-drafting"],
        "parameter_schema": {
            "underlying_engine": "Imagen 4 Fast",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"],
            "features": [
                "Next-generation Imagen architecture",
                "Fast text-to-image generation",
                "Sub-second composition rendering"
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
            "aspect_ratios": ["3:4", "9:16", "1:1"],
            "features": [
                "Specialized clothing simulation",
                "Realistic fabric drape & body shape adaptation",
                "Photorealistic apparel try-on"
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
        "supported_tasks": ["image-editing", "inpainting", "canvas-modification"],
        "parameter_schema": {
            "underlying_engine": "Imagen 3 Capability 001",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3"],
            "features": [
                "Fast image editing",
                "Inpainting & localized correction",
                "High precision regional brush control"
            ],
            "description": "Fast image editing."
        },
        "base_credit_cost": 5.0,
        "cost_multiplier_rules": {"aspect_ratio": 1.0},
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
        "supported_tasks": ["text-to-image", "photorealism"],
        "parameter_schema": {
            "underlying_engine": "imagen-3.0-generate-002",
            "aspect_ratios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
            "features": [
                "Exceptional photorealism",
                "High prompt adherence",
                "Crisp, legible text rendering"
            ],
            "description": "General photorealism and high-fidelity text-heavy image synthesis."
        },
        "base_credit_cost": 8.0,
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

        # 1. Remove legacy models not in this Google catalog
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
