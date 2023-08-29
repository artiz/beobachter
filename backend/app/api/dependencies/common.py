import datetime
from typing import Any, List
import aioredis.client
from fastapi import Depends, HTTPException, status

from app.core.config import settings
from app.core import util
from app.core.global_app import redis_connection_pool


# Dependency
async def get_redis():
    r = aioredis.client.Redis(connection_pool=redis_connection_pool)
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

        async def get_raw_metrics(self, metric) -> List[tuple[int, Any]]:
            redis = self.redis

            series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}"
            exists = await redis.exists(series)
            if not exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Incorrect metric name: {series}",
                )

            # history part
            series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}_hour"
            points = await redis.execute_command("TS.RANGE", series, "0", "+")
            last_ts = points[-1][0] if len(points) > 0 else 0

            series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}_min"
            min_points = await redis.execute_command(
                "TS.RANGE", series, last_ts, "+"
            )
            last_ts = min_points[-1][0] if len(min_points) > 0 else 0
            points.extend(min_points)

            # series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}"
            # sec_points = await redis.execute_command(
            #     "TS.RANGE", series, last_ts, "+"
            # )
            # points.extend(sec_points)

            return points

        async def get_metrics(
            self, metric, count: int | None = None
        ) -> List[tuple[int, float]]:
            raw_points = await self.get_raw_metrics(metric)
            points = [[ts, float(v)] for [ts, v] in raw_points]

            if count != None:
                now = util.utc_now()
                start = now - 360_000

                if len(points) == 0:
                    points = [[start, 0], [now, 0]]
                elif len(points) == 1:
                    v = points[0][1]
                    points = [[start, v], points[0], [now, v]]
                else:
                    points.append([now, points[-1][1]])

                start = points[0][0]
                r = points[-1][0] - start
                step = r / count

                cur_pnt = 0
                last_v = 0

                def point(pos: int) -> float:
                    nonlocal cur_pnt, step, last_v
                    if pos == 0:
                        last_v = points[0][1]
                        return points[0]
                    ts = start + step * pos

                    while cur_pnt < count and points[cur_pnt][0] < ts:
                        cur_pnt += 1

                    if abs(points[cur_pnt][0] < ts) < 1000:
                        v = points[cur_pnt][1]
                    else:
                        v = (
                            last_v
                            + (points[cur_pnt][1] - last_v)
                            * (points[cur_pnt][0] - ts)
                            * step
                        )

                    last_v = v
                    return [ts, v]

                processed = [point(n) for n in range(0, count)]

                return processed

            return points

    return Srv(redis)
