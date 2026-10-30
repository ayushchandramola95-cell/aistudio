import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    APP_SECRET_KEY: str = "super-secret-aistudio-key-dev-mode-32chars"
    API_PORT: int = 8100
    WEB_PORT: int = 3100
    API_BASE_URL: str = "http://localhost:8100"
    WEB_BASE_URL: str = "http://localhost:3100"
    
    # Database: Defaults to local SQLite async for zero-friction local development,
    # and supports PostgreSQL via DATABASE_URL env var.
    DATABASE_URL: str = "sqlite+aiosqlite:///./aistudio.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET: str = "jwt-secret-aistudio-dev-mode-change-in-prod"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Initial free signup credits
    NEW_USER_CREDITS: float = 100.0

    # Google GenAI / Vertex AI configuration
    GEMINI_API_KEY: str | None = None
    GOOGLE_GENAI_API_KEY: str | None = None
    GOOGLE_CLOUD_PROJECT: str | None = None
    GOOGLE_CLOUD_REGION: str = "us-central1"
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    VERTEX_AI: bool = False

    # Output storage
    STORAGE_DIR: str = "services/api/storage"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

# Propagate credentials to OS environment for GCP SDKs
if settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
elif os.path.exists("gcp-key.json"):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath("gcp-key.json")

if settings.GOOGLE_CLOUD_PROJECT:
    os.environ["GOOGLE_CLOUD_PROJECT"] = settings.GOOGLE_CLOUD_PROJECT

