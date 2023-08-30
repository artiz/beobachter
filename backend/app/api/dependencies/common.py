import datetime
from typing import Any, List
import aioredis.client
from fastapi import Depends, HTTPException, status

from app.core.config import settings
from app.core import util
from app.core.global_app import redis_connection_pool
from app.core.metrics.performance import PerfMetricsService


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
    srv = PerfMetricsService(redis)
    try:
        yield srv
    finally:
        await srv.shutdown()
