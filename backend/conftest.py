import logging
import pytest, pytest_asyncio
import asyncio
import random, string
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy_utils import database_exists, create_database, drop_database

# from fastapi.testclient import TestClient
from httpx import AsyncClient
import typing as t
from unittest.mock import patch

from app.core import security
from app.core.config import settings

from app.db.session import Base, get_db
from app.db import models
from app.main import app
from app.core import util


def random_char(y):
    return "".join(random.choice(string.ascii_letters) for x in range(y))


def get_test_db_url() -> str:
    return f"{settings.DATABASE_URI}_test"


@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    """
    Create a test database and use it for the whole test session.
    """

    test_db_url = get_test_db_url().replace("+asyncpg", "")
    if not database_exists(test_db_url):
        create_database(test_db_url)

    test_engine = create_engine(test_db_url, echo=False)
    Base.metadata.create_all(test_engine)

    # Run the tests
    yield

    # Drop the test database
    drop_database(test_db_url)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture()
async def test_db():
    engine = create_async_engine(get_test_db_url(), future=True)
    session = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)
    db = session()
    try:
        nested = await db.begin_nested()
        yield db
    finally:
        if nested and nested.is_active:
            await nested.rollback()
        await db.close()


@pytest_asyncio.fixture()
async def client(test_db):
    """
    Get a TestClient instance that reads/write to the test database.
    """

    def get_test_db():
        yield test_db

    app.dependency_overrides[get_db] = get_test_db

    client = AsyncClient(app=app, base_url="http://test")
    try:
        yield client
    finally:
        await client.aclose()


@pytest_asyncio.fixture()
def test_password() -> str:
    return "securepassword"


def get_password_hash() -> str:
    """
    Password hashing can be expensive so a mock will be much faster
    """
    return "supersecrethash"


@pytest_asyncio.fixture()
async def test_user(test_db: AsyncSession) -> models.User:
    """
    Make a test user in the database
    """

    user = models.User(
        email=random_char(16) + "@email.com",
        hashed_password=get_password_hash(),
        is_active=True,
    )
    test_db.add(user)
    await test_db.commit()
    return user


@pytest_asyncio.fixture()
async def test_superuser(test_db) -> models.User:
    """
    Superuser for testing
    """

    user = models.User(
        email=random_char(16) + ".admin@email.com",
        hashed_password=get_password_hash(),
        is_superuser=True,
    )
    test_db.add(user)
    await test_db.commit()
    return user


def verify_password_mock(first: str, second: str) -> bool:
    return True


@pytest_asyncio.fixture()
async def user_token_headers(client, test_user, test_password, monkeypatch) -> t.Dict[str, str]:
    monkeypatch.setattr(security, "verify_password", verify_password_mock)

    login_data = {
        "username": test_user.email,
        "password": test_password,
    }
    r = await client.post("/api/auth/login", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers


@pytest_asyncio.fixture()
async def superuser_token_headers(client, test_superuser, test_password, monkeypatch) -> t.Dict[str, str]:
    monkeypatch.setattr(security, "verify_password", verify_password_mock)

    login_data = {
        "username": test_superuser.email,
        "password": test_password,
    }
    r = await client.post("/api/auth/login", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers
