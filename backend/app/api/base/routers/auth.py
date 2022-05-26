from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta

from app.db.session import get_db
from app.db import models
from app.core import security
from app.core.auth import authenticate_user, sign_up_new_user

auth_router = r = APIRouter()


@r.post("/login")
async def login(
    db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = security.create_access_token(
        data=format_user(user),
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@r.post("/signup")
async def signup(
    db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = sign_up_new_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists",
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = security.create_access_token(
        data=format_user(user),
        expires_delta=access_token_expires,
    )

    return {"user": user, "access_token": access_token, "token_type": "bearer"}


def format_user(user: models.User):
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
