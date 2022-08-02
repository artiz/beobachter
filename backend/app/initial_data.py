#!/usr/bin/env python3

import sys
import asyncio

sys.path.append(".")

from app.db.crud import create_user
from app.core.schemas.schemas import UserCreate
from app.db.session import session


async def create_superuser(db) -> None:
    user = await create_user(
        db,
        UserCreate(
            email="admin5@fastapi-react-project.com",
            password="password",
            first_name="Admin",
            is_active=True,
            is_superuser=True,
        ),
    )

    await db.close()
    return user


async def init():
    db = session()
    db.begin()

    try:
        user = await create_superuser(db)
        print(f"Superuser {user.email} created")
    except Exception as e:
        print("Superuser creation failed: ", repr(e))

    await db.close()


if __name__ == "__main__":
    # try:
    user = asyncio.run(init())
