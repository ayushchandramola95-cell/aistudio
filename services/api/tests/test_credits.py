import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from services.api.src.database import Base
from services.api.src.models.user import User
from services.api.src.services.credit_service import CreditService, InsufficientCreditsError

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def async_session():
    test_engine = create_async_engine(TEST_DB_URL, echo=False)
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    TestSession = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)
    async with TestSession() as session:
        yield session
    
    await test_engine.dispose()

@pytest.mark.asyncio
async def test_credit_ledger_lifecycle(async_session):
    # 1. Create a user
    user = User(email="tester@aistudio.com", hashed_password="hashed_secret", role="user")
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)

    # 2. Get initial account with 100 credits
    account = await CreditService.get_or_create_account(async_session, user.id, initial_credits=100.0)
    assert account.balance == 100.0
    assert account.reserved == 0.0
    assert account.available == 100.0

    # 3. Reserve 20 credits for a generation job
    account = await CreditService.reserve_credits(
        async_session, user.id, amount=20.0, idempotency_key="job-test-1", job_id="job-1"
    )
    assert account.balance == 100.0
    assert account.reserved == 20.0
    assert account.available == 80.0

    # 4. Settle the 20 credits on job completion
    account = await CreditService.settle_credits(
        async_session, user.id, amount=20.0, idempotency_key="job-settle-1", job_id="job-1"
    )
    assert account.balance == 80.0
    assert account.reserved == 0.0
    assert account.available == 80.0
    assert account.lifetime_spent == 20.0

    # 5. Test refund on failure: reserve 30 credits
    account = await CreditService.reserve_credits(
        async_session, user.id, amount=30.0, idempotency_key="job-test-2", job_id="job-2"
    )
    assert account.reserved == 30.0
    assert account.available == 50.0

    # Refund the 30 credits
    account = await CreditService.refund_credits(
        async_session, user.id, amount=30.0, idempotency_key="job-refund-2", job_id="job-2"
    )
    assert account.balance == 80.0
    assert account.reserved == 0.0
    assert account.available == 80.0

    # 6. Test insufficient credits rejection
    with pytest.raises(InsufficientCreditsError):
        await CreditService.reserve_credits(
            async_session, user.id, amount=999.0, idempotency_key="job-test-overspend"
        )
