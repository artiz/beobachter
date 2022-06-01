from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings

# async examples:
# https://docs.sqlalchemy.org/en/14/_modules/examples/asyncio/gather_orm_statements.html
# https://docs.sqlalchemy.org/en/14/orm/examples.html#examples-asyncio
#
engine = create_async_engine(
    settings.DATABASE_URI,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_size=settings.DATABASE_POOL_SIZE,
)

session = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

# Dependency
async def get_db():
    db = session()
    try:
        db.begin()
        yield db
    finally:
        await db.close()
