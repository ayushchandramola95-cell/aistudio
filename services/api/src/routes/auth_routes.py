import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.src.database import get_db
from services.api.src.config import settings
from services.api.src.models.user import User
from services.api.src.services.credit_service import CreditService
from services.api.src.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8")[:72],
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(
        password.encode("utf-8")[:72],
        salt
    ).decode("utf-8")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

async def get_current_user(
    authorization: str | None = Header(None),
    session: AsyncSession = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        # Dev-friendly fallback: return or auto-create a default test user if no token provided in development
        if settings.ENVIRONMENT == "development":
            demo = await session.execute(select(User).where(User.email == "demo@aistudio.com"))
            user = demo.scalar_one_or_none()
            if not user:
                user = User(
                    email="demo@aistudio.com",
                    hashed_password=get_password_hash("demo123"),
                    full_name="Creative Explorer",
                    role="admin"
                )
                session.add(user)
                await session.commit()
                await session.refresh(user)
                await CreditService.get_or_create_account(session, user.id, settings.NEW_USER_CREDITS)
            return user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token credentials")

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
async def register(payload: UserRegisterRequest, session: AsyncSession = Depends(get_db)):
    existing = await session.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name or payload.email.split("@")[0],
        role="user"
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Initialize credits
    await CreditService.get_or_create_account(session, new_user.id, settings.NEW_USER_CREDITS)

    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(new_user))

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
