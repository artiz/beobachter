import jwt
from fastapi import Depends, HTTPException, status, Header, Query, Request
from fastapi.security.utils import get_authorization_scheme_param
from typing import Optional, Tuple

from app.db.session import get_db
from app.db import models
from app.db.crud import get_user_by_email, create_user
from app.core import security
from app.core.config import settings
from app.core.schemas import schemas
from app.api.dependencies.common import get_log


async def auth_bearer_token(
    header: str = Depends(security.oauth2_scheme),
    authorization: Optional[str] = Header(default=""),
    token: Optional[str] = Query(default=""),
):
    if token:
        return token
    scheme, param = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != "bearer":
        return ""
    return param


async def query_token(token: Optional[str] = Query(default="")):
    return token


async def ws_protocol(sec_websocket_protocol: Optional[str] = Header(default="")):
    return sec_websocket_protocol


async def get_current_user(
    db=Depends(get_db),
    token: str = Depends(auth_bearer_token),
) -> schemas.UserBase:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = await get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user


async def check_current_user(
    db=Depends(get_db),
    log=Depends(get_log),
    token: str = Depends(auth_bearer_token),
) -> Tuple[schemas.UserBase, str]:
    """Check authentication user presence. No exceptions are thrown."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return (None, token)

        email: str = payload.get("sub")

    except Exception as er:
        await log.error(er)
        return (None, token)

    user = await get_user_by_email(db, email)
    return (user, token)


async def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
):
    if not current_user.is_active:
        raise HTTPException(status_code=401, detail="Inactive user")
    return current_user


async def check_current_active_user(
    user_data: Tuple[schemas.UserBase, str] = Depends(check_current_user),
) -> Tuple[schemas.UserBase, str]:
    if not user_data or not user_data[0] or not user_data[0].is_active:
        return None
    return user_data


async def get_jwt_token_decoder():
    def decoder(token: str):
        jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

    return decoder


async def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user


async def authenticate_user(db, email: str, password: str):
    user = await get_user_by_email(db, email)
    if not user:
        return False
    if not user.is_active:
        return False
    if not security.verify_password(password, user.hashed_password):
        return False

    return user


async def sign_up_new_user(db, user: schemas.UserEdit) -> models.User:
    existing = await get_user_by_email(db, user.email)
    if existing:
        return False  # User already exists

    new_user = await create_user(
        db,
        schemas.UserCreate(
            email=user.email,
            password=user.password,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=True,
            is_superuser=False,
        ),
    )
    return new_user
