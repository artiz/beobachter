from email.mime import base
import aioredis

from app.core.config import settings
from app.core.global_app import get_system_metrics_broadcaster

# Dependency
async def get_redis():
    r = await aioredis.from_url(settings.REDIS_URI)
    try:
        yield r
    finally:
        await r.close()


def get_system_metrics_manager():
    return get_system_metrics_broadcaster()
