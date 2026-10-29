from datetime import datetime, timezone
from sqlalchemy import String, Numeric, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from services.api.src.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class ModelRegistry(Base):
    __tablename__ = "models_registry"

    id: Mapped[str] = mapped_column(String(64), primary_key=True) # e.g. 'imagen-3', 'flux-1-dev'
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    provider: Mapped[str] = mapped_column(String(60), nullable=False) # google-cloud, bfl, stability, custom-gpu
    family: Mapped[str] = mapped_column(String(60), nullable=False) # imagen, flux, sdxl, veo, whisper, gemini
    version: Mapped[str] = mapped_column(String(30), nullable=False)
    backend_type: Mapped[str] = mapped_column(String(30), default="hosted_api", nullable=False) # hosted_api, gpu_worker
    supported_tasks: Mapped[list] = mapped_column(JSON, default=list, nullable=False) # ['text-to-image']
    parameter_schema: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    base_credit_cost: Mapped[float] = mapped_column(Numeric(10, 2), default=10.0, nullable=False)
    cost_multiplier_rules: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    min_vram_gb: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False) # active, maintenance, disabled
    commercial_license: Mapped[str] = mapped_column(String(60), default="commercial-ok", nullable=False)
    is_approved_for_paid: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    jobs = relationship("GenerationJob", back_populates="model")

