import os
from typing import Optional
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "fastapi-react-project"

    DATABASE_URI: Optional[str] = "sqlite:///example.db"

    # Web
    API_V1: str = "/api/v1"
    JWT_SECRET: str = "TEST_SECRET_DO_NOT_USE_IN_PROD"
    JWT_ALGORITHM: str = "HS256"

    # Monitoring
    CELERY_BROKER: str = "redis://redis:6379/0"
    REDIS_URI: str = "redis://redis:6379"

    PERF_DATA_PREFIX: str = "perf_data_"
    PERF_DATA_CHANNEL: str = "perf_data_channel"
    PERF_DATA_INTERVAL: float = 1.0


settings = Settings()
