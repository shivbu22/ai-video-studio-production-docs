from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.entities import CreditLedger

class CreditService:
    @staticmethod
    async def get_balance(session: AsyncSession, user_id: str) -> int:
        """Derive the current real-time balance from the append-only ledger."""
        stmt = select(func.coalesce(func.sum(CreditLedger.delta), 0)).where(CreditLedger.user_id == user_id)
        result = await session.execute(stmt)
        return int(result.scalar_one())

    @staticmethod
    async def grant_credits(session: AsyncSession, user_id: str, amount: int, reason: str) -> CreditLedger:
        """Grant credits (positive delta) upon subscription renewal or purchase."""
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
        """Hold credits when an expensive render job starts. Amount must be positive."""
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
    async def release_hold(session: AsyncSession, user_id: str, job_id: str, amount: int) -> CreditLedger:
        """Release credits back to available balance if render fails or is canceled."""
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
