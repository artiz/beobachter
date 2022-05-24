import asyncio
from app.core.config import settings

from app.core.net.websocket import RedisBroadcaster

system_metrics_broadcaster = RedisBroadcaster(
    settings.REDIS_URI, settings.PERF_DATA_CHANNEL
)


async def shutdown():
    await system_metrics_broadcaster.stop()


async def startup():
    await system_metrics_broadcaster.run()


def get_system_metrics_broadcaster():
    return system_metrics_broadcaster
