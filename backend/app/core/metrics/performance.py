import psutil
import json
import redis
from datetime import datetime, timezone

from urllib.parse import urlparse
from app.core.config import settings


class Metrics:
    cpu_perc: float  # percent
    vm_perc: float  # percent
    ts: int

    def __str__(self) -> None:
        return f"CPU%: {self.cpu_perc}, VM%: {self.vm_perc}"


class PerfMetricsLoader:
    def __init__(self) -> None:
        u = urlparse(settings.REDIS_URI)
        self.r = redis.Redis(host=u.hostname, port=u.port)
        self.start = self.utc_now()
        # self.ps = self.r.pubsub()
        # ps.subscribe({ [settings.PERF_DATA_CHANNEL]: handle_perf_sub })

    def load(self) -> None:
        m = self._get_metrics()
        js = json.dumps(m, default=vars)

        offset = m.ts - self.start
        exp = self.get_sparse_expiration(offset)
        self.r.set(settings.PERF_DATA_PREFIX + str(m.ts), js, ex=exp)
        self.r.publish(settings.PERF_DATA_CHANNEL, js)

    def utc_now(self) -> int:
        return int(datetime.now(timezone.utc).timestamp())

    def get_sparse_expiration(self, period: int) -> Metrics:
        """Calc sparsed expiration to store time series in Redis"""
        # TODO: move to helper

        min15 = 900
        hour = 3600
        day = hour * 24
        month = day * 30

        exp = min15  # sec

        if period % min15 == 0:
            exp = 3600 * 24
        elif period % 3600 == 0:
            exp = month
        elif period % day == 0:
            exp = month * 12

        return exp

    def _get_metrics(self) -> Metrics:
        mem = psutil.virtual_memory()
        m = Metrics()
        m.ts = self.utc_now()
        m.cpu_perc = psutil.cpu_percent(settings.PERF_DATA_INTERVAL)
        m.vm_perc = mem.percent

        return m
