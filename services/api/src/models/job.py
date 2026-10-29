import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Numeric, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from services.api.src.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    model_id: Mapped[str] = mapped_column(String(64), ForeignKey("models_registry.id"), nullable=False)
    task_type: Mapped[str] = mapped_column(String(40), nullable=False) # image_generation, video_generation, text_to_speech
    raw_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    enhanced_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    parameters: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(25), default="PENDING", index=True, nullable=False) # PENDING, RESERVED, QUEUED, PROCESSING, COMPLETED, FAILED, CANCELLED
    progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    internal_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    worker_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    credits_reserved: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    credits_charged: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    internal_cost: Mapped[float | None] = mapped_column(Numeric(10, 4), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="jobs")
    model = relationship("ModelRegistry", back_populates="jobs")
    outputs = relationship("JobOutput", back_populates="job", cascade="all, delete-orphan", lazy="selectin")

class JobOutput(Base):
    __tablename__ = "job_outputs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("generation_jobs.id", ondelete="CASCADE"), index=True, nullable=False)
    file_key: Mapped[str] = mapped_column(String(512), nullable=False)
    storage_provider: Mapped[str] = mapped_column(String(40), default="local", nullable=False) # gcs, r2, local
    mime_type: Mapped[str] = mapped_column(String(80), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration_seconds: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    thumbnail_key: Mapped[str | None] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    job = relationship("GenerationJob", back_populates="outputs")
