from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from services.api.src.models.credit import CreditAccount, CreditTransaction

class InsufficientCreditsError(HTTPException):
    def __init__(self, message: str = "Insufficient available credit balance."):
        super().__init__(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=message)

class CreditService:
    @staticmethod
    async def get_or_create_account(session: AsyncSession, user_id: str, initial_credits: float = 100.0) -> CreditAccount:
        query = select(CreditAccount).where(CreditAccount.user_id == user_id)
        result = await session.execute(query)
        account = result.scalar_one_or_none()
        
        if not account:
            account = CreditAccount(
                user_id=user_id,
                balance=initial_credits,
                reserved=0.0,
                lifetime_spent=0.0
            )
            session.add(account)
            await session.flush()
            
            # Initial transaction record
            tx = CreditTransaction(
                user_id=user_id,
                type="ADJUSTMENT",
                amount=initial_credits,
                balance_after=initial_credits,
                idempotency_key=f"welcome-bonus-{user_id}",
                reason="Welcome Bonus Credits"
            )
            session.add(tx)
            await session.commit()
            await session.refresh(account)
            
        return account

    @staticmethod
    async def reserve_credits(
        session: AsyncSession,
        user_id: str,
        amount: float,
        idempotency_key: str,
        job_id: str | None = None,
        reason: str | None = "Job Credit Reservation"
    ) -> CreditAccount:
        # Check idempotency first
        tx_check = await session.execute(
            select(CreditTransaction).where(CreditTransaction.idempotency_key == idempotency_key)
        )
        if tx_check.scalar_one_or_none():
            account = await CreditService.get_or_create_account(session, user_id)
            return account

        query = select(CreditAccount).where(CreditAccount.user_id == user_id).with_for_update()
        result = await session.execute(query)
        account = result.scalar_one_or_none()
        
        if not account:
            account = await CreditService.get_or_create_account(session, user_id)

        # Admin unlimited credit protection
        from services.api.src.models.user import User
        user_res = await session.execute(select(User).where(User.id == user_id))
        user_obj = user_res.scalar_one_or_none()
        is_admin = user_obj is not None and user_obj.role == "admin"

        available = float(account.balance) - float(account.reserved)
        if available < amount:
            if is_admin:
                # Auto-replenish admin for infinite generations
                account.balance = float(account.balance) + 1000000.0
                available = float(account.balance) - float(account.reserved)
            else:
                raise InsufficientCreditsError(
                    f"You need {amount:.1f} credits, but only have {available:.1f} available."
                )

        account.reserved = float(account.reserved) + amount
        
        tx = CreditTransaction(
            user_id=user_id,
            job_id=job_id,
            type="RESERVE",
            amount=-amount,
            balance_after=float(account.balance) - float(account.reserved),
            idempotency_key=idempotency_key,
            reason=reason
        )
        session.add(tx)
        await session.commit()
        await session.refresh(account)
        return account

    @staticmethod
    async def settle_credits(
        session: AsyncSession,
        user_id: str,
        amount: float,
        idempotency_key: str,
        job_id: str | None = None,
        reason: str | None = "Job Completed Settlement"
    ) -> CreditAccount:
        query = select(CreditAccount).where(CreditAccount.user_id == user_id).with_for_update()
        result = await session.execute(query)
        account = result.scalar_one_or_none()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        # Deduct from reserved and balance
        account.reserved = max(0.0, float(account.reserved) - amount)
        account.balance = max(0.0, float(account.balance) - amount)
        account.lifetime_spent = float(account.lifetime_spent) + amount

        tx = CreditTransaction(
            user_id=user_id,
            job_id=job_id,
            type="SETTLE",
            amount=-amount,
            balance_after=float(account.balance),
            idempotency_key=idempotency_key,
            reason=reason
        )
        session.add(tx)
        await session.commit()
        await session.refresh(account)
        return account

    @staticmethod
    async def refund_credits(
        session: AsyncSession,
        user_id: str,
        amount: float,
        idempotency_key: str,
        job_id: str | None = None,
        reason: str | None = "Job Failed Refund"
    ) -> CreditAccount:
        query = select(CreditAccount).where(CreditAccount.user_id == user_id).with_for_update()
        result = await session.execute(query)
        account = result.scalar_one_or_none()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        # Release reserved amount without touching main balance
        account.reserved = max(0.0, float(account.reserved) - amount)

        tx = CreditTransaction(
            user_id=user_id,
            job_id=job_id,
            type="REFUND",
            amount=amount,
            balance_after=float(account.balance) - float(account.reserved),
            idempotency_key=idempotency_key,
            reason=reason
        )
        session.add(tx)
        await session.commit()
        await session.refresh(account)
        return account

    @staticmethod
    async def purchase_credits(
        session: AsyncSession,
        user_id: str,
        amount: float,
        idempotency_key: str,
        reason: str = "Credit Package Purchase"
    ) -> CreditAccount:
        query = select(CreditAccount).where(CreditAccount.user_id == user_id).with_for_update()
        result = await session.execute(query)
        account = result.scalar_one_or_none()
        if not account:
            account = await CreditService.get_or_create_account(session, user_id)

        account.balance = float(account.balance) + amount

        tx = CreditTransaction(
            user_id=user_id,
            type="PURCHASE",
            amount=amount,
            balance_after=float(account.balance),
            idempotency_key=idempotency_key,
            reason=reason
        )
        session.add(tx)
        await session.commit()
        await session.refresh(account)
        return account

