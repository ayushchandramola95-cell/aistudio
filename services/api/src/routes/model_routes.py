from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from services.api.src.database import get_db
from services.api.src.services.model_service import ModelService
from services.api.src.schemas.model import ModelListResponse, ModelResponse

router = APIRouter(prefix="/api/v1/models", tags=["Model Registry"])

@router.get("", response_model=ModelListResponse)
async def get_models(session: AsyncSession = Depends(get_db)):
    models = await ModelService.list_models(session)
    return ModelListResponse(models=[ModelResponse.model_validate(m) for m in models])
