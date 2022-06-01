import asyncio
from app.core.config import settings
from app.core import util
from app.core.net.websocket import RedisBroadcaster

system_metrics_broadcaster = RedisBroadcaster(settings.REDIS_URI, settings.PERF_METRICS_PS_CHANNEL, "metrics")


async def startup():
    await system_metrics_broadcaster.run()


async def shutdown():
    await system_metrics_broadcaster.stop()
