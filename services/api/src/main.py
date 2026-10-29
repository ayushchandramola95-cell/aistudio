from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.api.src.config import settings
from services.api.src.database import engine, Base, AsyncSessionLocal
from services.api.src.services.model_service import ModelService
from services.api.src.routes.auth_routes import router as auth_router
from services.api.src.routes.credit_routes import router as credit_router
from services.api.src.routes.model_routes import router as model_router
from services.api.src.routes.job_routes import router as job_router
from services.api.src.routes.health_routes import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed initial models
    async with AsyncSessionLocal() as session:
        await ModelService.seed_initial_models(session)
        
    yield
    
    # Teardown
    await engine.dispose()

app = FastAPI(
    title="AI Studio API",
    description="Backend API Gateway and Credit Engine for Multi-Model AI Generation Platform",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration allowing our unique frontend localhost:3100
origins = [
    "http://localhost:3100",
    "http://127.0.0.1:3100",
    settings.WEB_BASE_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(credit_router)
app.include_router(model_router)
app.include_router(job_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.src.main:app", host="0.0.0.0", port=settings.API_PORT, reload=True)
