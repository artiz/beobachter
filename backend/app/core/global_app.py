import aioredis
from app.core.config import settings
from app.core.net.websocket import RedisBroadcaster

system_metrics_broadcaster = RedisBroadcaster(settings.REDIS_URI, settings.PERF_METRICS_PS_CHANNEL, "metrics")
redis_connection_pool: aioredis.ConnectionPool = aioredis.ConnectionPool.from_url(
    settings.REDIS_URI, decode_responses=True
)


async def startup():
    await system_metrics_broadcaster.run()
    await redis_connection_pool.make_connection()


async def shutdown():
    await system_metrics_broadcaster.stop()
    await redis_connection_pool.disconnect()
