from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from typing import List

from . import models

from app.core.schemas import schemas
from app.core.security import get_password_hash


async def get_user_by_email(db: AsyncSession, email: str) -> schemas.UserBase:
    iter = await db.execute(select(models.User).filter(models.User.email == email))
    res = iter.fetchone()
    return res[0] if res else None


async def get_user(db: AsyncSession, user_id: int):
    iter = await db.execute(select(models.User).filter(models.User.id == user_id))
    res = iter.fetchone()
    if not res:
        raise HTTPException(status_code=404, detail="User not found")
    return res[0]


async def get_users(db: AsyncSession, skip: int = 0, limit: int = 0) -> List[schemas.UserOut]:
    stmt = select(models.User).offset(skip).order_by(models.User.id)
    if limit > 0:
        stmt.limit(limit)
    r = await db.execute(stmt)
    return [r[0] for r in r.fetchall()]


async def create_user(db: AsyncSession, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)

    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        hashed_password=hashed_password,
    )

    try:
        db.add(db_user)
        await db.commit()
    except IntegrityError as ex:
        detail = ex.detail
        if not detail and ex.orig:
            detail = str(ex.orig)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=detail)

    await db.refresh(db_user)
    return db_user


async def delete_user(db: AsyncSession, user_id: int):
    user = await get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    await db.delete(user)
    await db.commit()
    return user


async def edit_user(db: AsyncSession, user_id: int, user: schemas.UserEdit) -> schemas.User:
    db_user = await get_user(db, user_id)
    if not db_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    update_data = user.model_dump(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(user.password)
        del update_data["password"]

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
