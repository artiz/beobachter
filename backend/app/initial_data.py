#!/usr/bin/env python3

from app.db.session import get_db
from app.db.crud import create_user
from app.core.schemas.schemas import UserCreate
from app.db.session import SessionLocal


def create_superuser() -> None:
    db = SessionLocal()

    return create_user(
        db,
        UserCreate(
            email="admin@fastapi-react-project.com",
            password="password",
            first_name="Admin",
            is_active=True,
            is_superuser=True,
        ),
    )


if __name__ == "__main__":
    try:
        user = create_superuser()
        print(f"Superuser {user.email} created")
    except Exception as e:
        print(f"Superuser creation failed: {e}")
