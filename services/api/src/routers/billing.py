from fastapi import APIRouter
from pydantic import BaseModel

billing_router = APIRouter(prefix="/billing", tags=["Billing & Subscription"])

class BillingStatusResponse(BaseModel):
    is_unmetered: bool
    plan_name: str
    credits_balance: str
    render_limit: str
    price_per_minute: int

@billing_router.get("/status", response_model=BillingStatusResponse)
async def get_billing_status():
    """
    Returns platform billing state.
    Strictly unmetered, zero barriers, unlimited 1080p rendering.
    """
    return {
        "is_unmetered": True,
        "plan_name": "Unlimited Creator Pass",
        "credits_balance": "UNLIMITED",
        "render_limit": "UNLIMITED",
        "price_per_minute": 0
    }

@billing_router.post("/topup")
async def mock_topup():
    return {
        "status": "success",
        "message": "Platform is fully unmetered. All rendering is 100% free.",
        "credits_balance": "UNLIMITED"
    }
