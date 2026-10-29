from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(tags=["Health"])

@router.get("/health")
@router.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "aistudio-api",
        "version": "0.1.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
