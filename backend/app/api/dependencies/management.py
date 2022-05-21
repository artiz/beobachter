from email.mime import base
import redis

from app.core.config import settings
from app.core.global_app import get_system_metrics_broadcaster

# Dependency
def get_redis():
    r = redis.Redis.from_url(settings.REDIS_URI)
    try:
        yield r
    finally:
        r.close()


def get_system_metrics_manager():
    return get_system_metrics_broadcaster()
