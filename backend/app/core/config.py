import os
from typing import List, Optional
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator
from pytz import VERSION


class Settings(BaseSettings):
    PROJECT_NAME: str = "beobachter"
    VERSION: str = "0.0.5"
    LOG_LEVEL: str = "info"

    DATABASE_URI: Optional[str] = "sqlite:///example.db"

    # Web
    PORT: int = 8888
    API: str = "/api"
    API_V2: str = "/api/v2"
    JWT_SECRET_KEY: str = "super_secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 120

    # Monitoring
    CELERY_BROKER: str = "redis://redis:6379/0"
    REDIS_URI: str = "redis://redis:6379/0"

    PERF_METRICS_KEY_PREFIX: str = "perf_data_"
    PERF_METRICS_PS_CHANNEL: str = "perf_metrics"
    PERF_METRICS_LOAD_INTERVAL: float = 1.0  # sec
    PERF_METRICS_PUBLISH_STEP: int = 1  # multiplier for load interval

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:8000",
        "http://192.168.100.29:8000",
    ]

    # Origins that match this regex OR are in the above list are allowed
    BACKEND_CORS_ORIGIN_REGEX: Optional[str] = "https.*\\.beobachter\\.herokuapp.com"


settings = Settings()
