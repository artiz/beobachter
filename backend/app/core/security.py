from typing import Dict, Optional, Union
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.utils import get_authorization_scheme_param
import jwt

from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.core.config import settings
from app.db import models
from app.core.schemas.schemas import Token


class AuthPasswordBearer(OAuth2PasswordBearer):
    """Stub class to get Auth working in API docs and on WS connection"""

    async def __call__(self) -> Optional[str]:
        return None


oauth2_scheme = AuthPasswordBearer(tokenUrl="/api/auth/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def format_token_data(user: models.User):
    if user.is_superuser:
        permissions = "admin"
    else:
        permissions = "user"

    return {
        "sub": user.email,
        "uid": user.id,
        "fn": user.first_name,
        "ln": user.last_name,
        "permissions": permissions,
    }


def create_access_token(user: models.User, expires_delta: timedelta = None) -> Token:
    if not expires_delta:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = format_token_data(user)
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    return {"access_token": encoded_jwt, "token_type": "bearer"}
