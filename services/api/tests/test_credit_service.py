import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from services.api.src.models.entities import Base, User, Plan, CreditLedger
from services.api.src.services.credit_service import CreditService

# In-memory SQLite for fast async unit testing
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def async_session():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        # Create test plan and user
        plan = Plan(id="plan_starter", name="Starter", monthly_credits=30, max_quality_tier="1080p", price_paise=290000)
        user = User(id="usr_test_123", email="creator@example.com", password_hash="hash", plan_id="plan_starter")
        session.add(plan)
        session.add(user)
        await session.commit()
        yield session
    
    await engine.dispose()

@pytest.mark.asyncio
async def test_initial_balance_is_zero(async_session: AsyncSession):
    balance = await CreditService.get_balance(async_session, "usr_test_123")
    assert balance == 0

@pytest.mark.asyncio
async def test_grant_and_hold_credits(async_session: AsyncSession):
    # 1. Grant 30 credits
    grant_entry = await CreditService.grant_credits(async_session, "usr_test_123", 30, reason="monthly_renewal")
    assert grant_entry.delta == 30
    assert grant_entry.balance_after == 30
    
    current_balance = await CreditService.get_balance(async_session, "usr_test_123")
    assert current_balance == 30

    # 2. Hold 5 credits for a 5-minute render
    hold_entry = await CreditService.hold_credits(async_session, "usr_test_123", job_id="job_render_1", amount=5)
    assert hold_entry.delta == -5
    assert hold_entry.balance_after == 25

    current_balance = await CreditService.get_balance(async_session, "usr_test_123")
    assert current_balance == 25

@pytest.mark.asyncio
async def test_insufficient_credits_hold_raises(async_session: AsyncSession):
    # Start with 5 credits
    await CreditService.grant_credits(async_session, "usr_test_123", 5, reason="gift")
    
    # Try holding 10 credits
    with pytest.raises(ValueError, match="Insufficient credits"):
        await CreditService.hold_credits(async_session, "usr_test_123", job_id="job_too_expensive", amount=10)

@pytest.mark.asyncio
async def test_release_hold_restores_balance(async_session: AsyncSession):
    await CreditService.grant_credits(async_session, "usr_test_123", 20, reason="purchase")
    await CreditService.hold_credits(async_session, "usr_test_123", job_id="job_failed_render", amount=4)
    
    balance_during_hold = await CreditService.get_balance(async_session, "usr_test_123")
    assert balance_during_hold == 16

    # Release hold
    release_entry = await CreditService.release_hold(async_session, "usr_test_123", job_id="job_failed_render", amount=4)
    assert release_entry.delta == 4
    assert release_entry.balance_after == 20

    final_balance = await CreditService.get_balance(async_session, "usr_test_123")
    assert final_balance == 20

@pytest.mark.asyncio
async def test_capture_hold_and_history(async_session: AsyncSession):
    await CreditService.grant_credits(async_session, "usr_test_123", 50, reason="purchase")
    await CreditService.hold_credits(async_session, "usr_test_123", job_id="job_success_render", amount=10)
    
    # Capture upon render success
    capture_entry = await CreditService.capture_hold(async_session, "usr_test_123", job_id="job_success_render")
    assert capture_entry.delta == 0
    assert capture_entry.reason == "capture"
    assert capture_entry.balance_after == 40

    history = await CreditService.get_history(async_session, "usr_test_123")
    assert len(history) == 3
    reasons = [h.reason for h in history]
    assert "grant" in reasons or "purchase" in reasons
    assert "hold" in reasons
    assert "capture" in reasons
