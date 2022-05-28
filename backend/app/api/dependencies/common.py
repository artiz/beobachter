import aioredis

from app.core.config import settings
from app.core import util


# Dependency
async def get_redis():
    r = await aioredis.from_url(settings.REDIS_URI, decode_responses=True)
    try:
        yield r
    finally:
        await r.close()


async def get_log():
    log = util.init_logger("api")

    try:
        yield log
    finally:
        await log.shutdown()
