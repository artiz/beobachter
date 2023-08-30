import psutil
import json
import redis.commands.timeseries
from redis import Redis
from celery.utils.log import get_task_logger
from typing import Any, List

from app.core.config import settings
from app.core.schemas.metrics import PerfMetrics
from app.core.util import utc_now

SEC = 1000
MIN = 60 * SEC
HOUR = 60 * MIN
DAY = 24 * HOUR


class PerfMetricsLoader:
    r: Redis
    start: int
    ts: redis.commands.timeseries.TimeSeries

    def __init__(self) -> None:
        self.logger = get_task_logger("PerfMetricsLoader")

    def init(self) -> None:
        self.r = Redis.from_url(settings.REDIS_URI)
        self.start = utc_now()
        self.ts = self.r.ts()

        for metric in PerfMetrics.Keys:
            key = settings.PERF_METRICS_KEY_PREFIX + metric
            labels = {"metric": metric, "type": "performance"}
            duplicate_policy = "last"
            if not self.r.exists(key):
                self.ts.create(
                    key,
                    labels=labels,
                    duplicate_policy=duplicate_policy,
                    retention_msecs=HOUR,
                )
            if not self.r.exists(key + "_min"):
                self.ts.create(
                    key + "_min",
                    labels=labels,
                    duplicate_policy=duplicate_policy,
                    retention_msecs=DAY,
                )
            if not self.r.exists(key + "_hour"):
                self.ts.create(
                    key + "_hour",
                    labels=labels,
                    duplicate_policy=duplicate_policy,
                )

            rules = self.ts.info(key).rules
            #  [[b'perf_data_cpu_p_min', 60000, b'AVG'], [b'perf_data_cpu_p_hour', 3600000, b'AVG']]
            if len(rules) < 1:
                self.ts.createrule(key, key + "_min", "avg", MIN)
            if len(rules) < 2:
                self.ts.createrule(key, key + "_hour", "avg", HOUR)

    def load(self) -> None:
        m = self._get_metrics()

        offset = m.ts - self.start

        for metric in PerfMetrics.Keys:
            key = settings.PERF_METRICS_KEY_PREFIX + metric
            self.ts.add(key, m.ts, getattr(m, metric))

        if offset % settings.PERF_METRICS_PUBLISH_STEP == 0:
            js = json.dumps(m, default=vars)
            self.r.publish(settings.PERF_METRICS_PS_CHANNEL, js)

    def _get_metrics(self) -> PerfMetrics:
        mem = psutil.virtual_memory()
        m = PerfMetrics(
            cpu_p=psutil.cpu_percent(),
            vm_p=mem.percent,
            ts=utc_now(),
        )

        return m


class PerfMetricsService:
    def __init__(self, redis):
        self.redis = redis

    async def shutdown(self):
        await self.redis.close()

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
        min_points = await redis.execute_command("TS.RANGE", series, last_ts, "+")
        last_ts = min_points[-1][0] if len(min_points) > 0 else 0
        points.extend(min_points)

        # series = f"{settings.PERF_METRICS_KEY_PREFIX}{metric}"
        # sec_points = await redis.execute_command(
        #     "TS.RANGE", series, last_ts, "+"
        # )
        # points.extend(sec_points)

        return points

    async def get_metrics(self, metric, count: int | None = None) -> List[tuple[int, float]]:
        raw_points = await self.get_raw_metrics(metric)
        points: List[tuple[int, float]] = [(ts, float(v)) for [ts, v] in raw_points]

        if count != None:
            now = utc_now()
            start = now - 360_000

            if len(points) == 0:
                points = [(start, 0), (now, 0)]
            elif len(points) == 1:
                v = points[0][1]
                points = [(start, v), points[0], (now, v)]
            else:
                points.append((now, points[-1][1]))

            start = points[0][0]
            r = points[-1][0] - start
            step = r // count

            cur_pnt = 0
            last_v = 0

            def point(pos: int) -> tuple[int, float]:
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
                    v = last_v + (points[cur_pnt][1] - last_v) * (points[cur_pnt][0] - ts) * step

                last_v = v
                return (ts, v)

            processed = [point(n) for n in range(0, count)]

            return processed

        return points
