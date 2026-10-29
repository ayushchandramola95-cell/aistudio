from pydantic import BaseModel, Field
from typing import Any
from datetime import datetime

class JobCreateRequest(BaseModel):
    model_id: str
    task_type: str = "image_generation"
    raw_prompt: str = Field(..., min_length=1, max_length=4000)
    parameters: dict[str, Any] = Field(default_factory=dict)
    auto_enhance: bool = False

class JobOutputResponse(BaseModel):
    id: str
    file_key: str
    storage_provider: str
    mime_type: str
    width: int | None
    height: int | None
    thumbnail_key: str | None
    download_url: str | None = None

    class Config:
        from_attributes = True

class JobResponse(BaseModel):
    id: str
    model_id: str
    task_type: str
    raw_prompt: str
    enhanced_prompt: str | None
    parameters: dict[str, Any]
    status: str
    progress: int
    error_message: str | None
    credits_reserved: float
    credits_charged: float
    created_at: datetime
    completed_at: datetime | None
    outputs: list[JobOutputResponse] = []

    class Config:
        from_attributes = True
