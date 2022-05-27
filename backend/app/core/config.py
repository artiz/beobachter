import os
from typing import List, Optional
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "fastapi-react-project"

    DATABASE_URI: Optional[str] = "sqlite:///example.db"

    # Web
    PORT: int = 8888
    API: str = "/api"
    API_V2: str = "/api/v2"
    JWT_SECRET: str = "TEST_SECRET_DO_NOT_USE_IN_PROD"
    JWT_ALGORITHM: str = "HS256"

    # Monitoring
    CELERY_BROKER: str = "redis://redis:6379/0"
    REDIS_URI: str = "redis://redis:6379/0"

    PERF_DATA_KEY: str = "perf_data_"
    PERF_DATA_CHANNEL: str = "perf_data_channel"
    PERF_DATA_INTERVAL: float = 1.0
    PERF_DATA_PUBLISH_STEP: int = 1  # multiplier for PERF_DATA_INTERVAL

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:8000",
        "http://192.168.100.29:8000",
    ]

    # Origins that match this regex OR are in the above list are allowed
    BACKEND_CORS_ORIGIN_REGEX: Optional[
        str
    ] = "https.*\.beobachter\.herokuapp.com"


settings = Settings()
