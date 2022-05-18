import os
from typing import Optional
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "fastapi-react-project"

    DATABASE_URI: Optional[str] = "sqlite:///example.db"

    API_V1: str = "/api/v1"
    JWT_SECRET: str = "TEST_SECRET_DO_NOT_USE_IN_PROD"
    JWT_ALGORITHM: str = "HS256"


settings = Settings()
