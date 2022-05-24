#!/usr/bin/env python3

from app.db.session import get_db
from app.db.crud import create_user
from app.core.schemas.schemas import UserCreate
from app.db.session import SessionLocal


def init() -> None:
    db = SessionLocal()

    create_user(
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
    print("Creating superuser admin@fastapi-react-project.com")
    init()
    print("Superuser created")
