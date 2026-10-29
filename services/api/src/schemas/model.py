from pydantic import BaseModel
from typing import Any

class ModelResponse(BaseModel):
    id: str
    display_name: str
    provider: str
    family: str
    version: str
    backend_type: str
    supported_tasks: list[str]
    parameter_schema: dict[str, Any]
    base_credit_cost: float
    status: str
    commercial_license: str
    is_approved_for_paid: bool

    class Config:
        from_attributes = True

class ModelListResponse(BaseModel):
    models: list[ModelResponse]

