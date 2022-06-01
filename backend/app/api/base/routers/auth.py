import asyncio
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta

from app.db.session import get_db
from app.db import models
from app.core import security
from app.core.config import settings
from app.core.net.auth import authenticate_user, sign_up_new_user

auth_router = r = APIRouter()


@r.post("/login")
async def login(db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = security.create_access_token(user)

    return token


@r.post("/signup")
async def signup(db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = await sign_up_new_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists",
        )

    token = security.create_access_token(user)

    return {"user": user, **token}
