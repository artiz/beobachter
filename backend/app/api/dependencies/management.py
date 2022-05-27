from email.mime import base
import aioredis

from app.core.config import settings
from app.core.global_app import system_metrics_broadcaster

# Dependency
async def get_redis():
    r = await aioredis.from_url(settings.REDIS_URI, decode_responses=True)
    try:
        yield r
    finally:
        await r.close()


def get_system_metrics_manager():
    return system_metrics_broadcaster
