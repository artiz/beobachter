#!/usr/bin/env python3

import sys
import asyncio

sys.path.append(".")

from app.db.crud import create_user, get_user_by_email
from app.core.schemas.schemas import UserCreate
from app.db.session import session


async def create_superuser(db) -> None:
    model = UserCreate(
        email="admin@fastapi-react-project.com",
        password="password",
        first_name="Admin",
        is_active=True,
        is_superuser=True,
    )
    user = await get_user_by_email(db, model.email)
    if not user:
        user = await create_user(db, model)
        print(f"Superuser {user.email} created")
    else:
        print(f"Superuser {user.email} already exists")

    await db.close()
    return user


async def init():
    db = session()
    db.begin()

    try:
        user = await create_superuser(db)
    except Exception as e:
        print("Superuser creation failed: ", repr(e))

    await db.close()


if __name__ == "__main__":
    user = asyncio.run(init())
