from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "OpenThaiAI Growth Engine"
    version: str = "1.0.0"
    debug: bool = False

    # Database
    database_url: str = "postgresql://openthai:secret@postgres:5432/openthaiai"

    # Redis
    redis_url: str = "redis://redis:6379/0"
    celery_broker_url: str = "redis://redis:6379/0"
    celery_result_backend: str = "redis://redis:6379/1"

    # JWT
    secret_key: str = "CHANGE_ME_IN_PRODUCTION_USE_SECRETS_MANAGER"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_pro_monthly: str = ""   # price_xxx
    stripe_price_biz_monthly: str = ""   # price_xxx

    # AI APIs
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # App URL
    frontend_url: str = "https://app.openthaiai.com"

    # Sentry
    sentry_dsn: str = ""

    # Credits per plan
    free_credits: int = 100
    pro_credits: int = 5000
    biz_credits: int = 20000
    credit_cost_content: int = 10
    credit_cost_voice: int = 20
    credit_cost_summary: int = 5
    credit_cost_agent: int = 30

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
