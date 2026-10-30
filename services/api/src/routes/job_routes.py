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
from services.api.src.schemas.job import JobCreateRequest, JobResponse, JobOutputResponse

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
