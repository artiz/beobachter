import psutil
import json
import redis
from datetime import datetime, timezone

from app.core.config import settings
from app.core.schemas.metrics import PerfMetrics


class PerfMetricsLoader:
    def __init__(self) -> None:
        self.r = redis.Redis.from_url(settings.REDIS_URI)
        self.start = self.utc_now()

    def load(self) -> None:
        m = self._get_metrics()
        js = json.dumps(m, default=vars)

        offset = m.ts - self.start
        exp = self.get_sparse_expiration(offset)
        self.r.set(settings.PERF_DATA_PREFIX + str(m.ts), js, ex=exp)

        if offset % settings.PERF_DATA_PUBLISH_STEP == 0:
            self.r.publish(settings.PERF_DATA_CHANNEL, js)

    def utc_now(self) -> int:
        return int(datetime.now(timezone.utc).timestamp())

    def get_sparse_expiration(self, period: int) -> PerfMetrics:
        """Calc sparsed expiration to store time series in Redis"""
        # TODO: move to helper

        min15 = 900  # sec
        hour = 3600
        day = hour * 24
        week = day * 7
        month = day * 30

        exp = min15

        if period % min15 == 0:
            exp = 3600 * 24
        elif period % 3600 == 0:
            exp = week
        elif period % (3600 * 4) == 0:
            exp = month
        elif period % day == 0:
            exp = month * 12

        return exp

    def _get_metrics(self) -> PerfMetrics:
        mem = psutil.virtual_memory()
        m = PerfMetrics(
            cpu_perc=psutil.cpu_percent(),
            vm_perc=mem.percent,
            ts=self.utc_now(),
        )

        return m
