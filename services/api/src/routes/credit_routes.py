import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from services.api.src.database import get_db
from services.api.src.models.user import User
from services.api.src.models.credit import CreditTransaction
from services.api.src.services.credit_service import CreditService
from services.api.src.routes.auth_routes import get_current_user
from services.api.src.schemas.credit import (
    CreditBalanceResponse,
    CreditTransactionResponse,
    PurchaseCreditsRequest
)

router = APIRouter(prefix="/api/v1/credits", tags=["Credits & Billing"])

@router.get("/balance", response_model=CreditBalanceResponse)
async def get_balance(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    account = await CreditService.get_or_create_account(session, current_user.id)
    return CreditBalanceResponse(
        user_id=current_user.id,
        balance=float(account.balance),
        reserved=float(account.reserved),
        available=account.available,
        lifetime_spent=float(account.lifetime_spent)
    )

@router.get("/transactions", response_model=list[CreditTransactionResponse])
async def list_transactions(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
    limit: int = 50
):
    query = (
        select(CreditTransaction)
        .where(CreditTransaction.user_id == current_user.id)
        .order_by(desc(CreditTransaction.created_at))
        .limit(limit)
    )
    result = await session.execute(query)
    txs = result.scalars().all()
    return [CreditTransactionResponse.model_validate(tx) for tx in txs]

@router.post("/purchase", response_model=CreditBalanceResponse)
async def purchase_credits(
    payload: PurchaseCreditsRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    idempotency_key = f"purchase-{current_user.id}-{uuid.uuid4().hex[:12]}"
    account = await CreditService.purchase_credits(
        session=session,
        user_id=current_user.id,
        amount=payload.amount,
        idempotency_key=idempotency_key,
        reason=f"Purchased {payload.package_name} pack (${payload.price_usd:.2f})"
    )
    return CreditBalanceResponse(
        user_id=current_user.id,
        balance=float(account.balance),
        reserved=float(account.reserved),
        available=account.available,
        lifetime_spent=float(account.lifetime_spent)
    )

