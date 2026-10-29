from pydantic import BaseModel
from datetime import datetime

class CreditBalanceResponse(BaseModel):
    user_id: str
    balance: float
    reserved: float
    available: float
    lifetime_spent: float

class CreditTransactionResponse(BaseModel):
    id: str
    type: str
    amount: float
    balance_after: float
    reason: str | None
    created_at: datetime
    job_id: str | None

    class Config:
        from_attributes = True

class PurchaseCreditsRequest(BaseModel):
    package_name: str
    amount: float
    price_usd: float
