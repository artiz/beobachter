import aioredis
from fastapi import Depends, HTTPException, status

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


async def get_metrics_service(redis=Depends(get_redis)):
    class Srv:
        def __init__(self, redis):
            self.redis = redis

        async def get_metrics(self, metric):
            redis = self.redis
            # history part
            series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}_hour"
            exists = await redis.exists(series)
            if not exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Incorrect metric name: {series}",
                )

            points = await redis.execute_command("TS.RANGE", series, "0", "+")
            last_ts = points[-1][0] if len(points) > 0 else 0

            series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}_min"
            exists = await redis.exists(series)
            if not exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Incorrect metric name: {series}",
                )

            min_points = await redis.execute_command("TS.RANGE", series, last_ts, "+")
            points.extend(min_points)

            return points

    return Srv(redis)
