from typing import List, Optional
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.entities import CreditLedger

class CreditService:
    @staticmethod
    async def get_balance(session: AsyncSession, user_id: str) -> int:
        """Derive current real-time spendable balance from append-only ledger SUM(delta)."""
        stmt = select(func.coalesce(func.sum(CreditLedger.delta), 0)).where(CreditLedger.user_id == user_id)
        result = await session.execute(stmt)
        return int(result.scalar_one())

    @staticmethod
    async def grant_credits(session: AsyncSession, user_id: str, amount: int, reason: str = "grant") -> CreditLedger:
        """Grant credits (positive delta) upon subscription renewal or pack purchase."""
        if amount <= 0:
            raise ValueError(f"Grant amount must be positive, got {amount}")
        current_balance = await CreditService.get_balance(session, user_id)
        new_balance = current_balance + amount
        entry = CreditLedger(
            user_id=user_id,
            delta=amount,
            reason=reason,
            balance_after=new_balance
        )
        session.add(entry)
        await session.flush()
        return entry

    @staticmethod
    async def hold_credits(session: AsyncSession, user_id: str, job_id: str, amount: int) -> CreditLedger:
        """Hold credits when an expensive master render starts. Reduces available balance."""
        if amount <= 0:
            raise ValueError(f"Hold amount must be positive, got {amount}")
        current_balance = await CreditService.get_balance(session, user_id)
        if current_balance < amount:
            raise ValueError(f"Insufficient credits: required {amount}, available {current_balance}")
        
        new_balance = current_balance - amount
        entry = CreditLedger(
            user_id=user_id,
            job_id=job_id,
            delta=-amount,
            reason="hold",
            balance_after=new_balance
        )
        session.add(entry)
        await session.flush()
        return entry

    @staticmethod
    async def capture_hold(session: AsyncSession, user_id: str, job_id: str) -> CreditLedger:
        """Record successful capture of held credits upon render completion."""
        current_balance = await CreditService.get_balance(session, user_id)
        entry = CreditLedger(
            user_id=user_id,
            job_id=job_id,
            delta=0,
            reason="capture",
            balance_after=current_balance
        )
        session.add(entry)
        await session.flush()
        return entry

    @staticmethod
    async def release_hold(session: AsyncSession, user_id: str, job_id: str, amount: int) -> CreditLedger:
        """Release credits back to available balance if render fails or is canceled."""
        if amount <= 0:
            raise ValueError(f"Release amount must be positive, got {amount}")
        current_balance = await CreditService.get_balance(session, user_id)
        new_balance = current_balance + amount
        entry = CreditLedger(
            user_id=user_id,
            job_id=job_id,
            delta=amount,
            reason="release",
            balance_after=new_balance
        )
        session.add(entry)
        await session.flush()
        return entry

    @staticmethod
    async def get_history(session: AsyncSession, user_id: str, limit: int = 50, offset: int = 0) -> List[CreditLedger]:
        """Fetch audit log of user credit transactions."""
        stmt = (
            select(CreditLedger)
            .where(CreditLedger.user_id == user_id)
            .order_by(desc(CreditLedger.created_at))
            .limit(limit)
            .offset(offset)
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())
