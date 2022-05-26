from fastapi import APIRouter, WebSocket, Depends, Response
from typing import List
import asyncio

from app.core.auth import check_current_active_user, get_current_active_user
from app.core.config import settings
from app.core.net.websocket import ConnectionManager
from app.core.schemas.metrics import PerfMetrics
from app.api.dependencies.management import (
    get_system_metrics_manager,
    get_redis,
)

system_router = r = APIRouter()


@r.websocket("/ws_system_metrics")
async def ws_system_metrics(
    websocket: WebSocket,
    manager: ConnectionManager = Depends(get_system_metrics_manager),
    current_user=Depends(check_current_active_user),
):
    """
    Websocket channel with system performance data updates
    """
    if not current_user:
        return await manager.process_auth_error(websocket)

    await manager.connect(websocket)
    try:
        while True:
            if manager.stopped():
                break
            await asyncio.sleep(0.5)
    except Exception as ex:
        # TODO: use logger
        print("ws_system_metrics error", ex)
    finally:
        await manager.disconnect(websocket)


@r.get("/system_metrics")  # , response_model=List[PerfMetrics]
async def system_metrics(
    redis=Depends(get_redis),
    current_user=Depends(get_current_active_user),
):
    """
    Get with system performance data
    """
    batch, cr = 100, 0
    m = settings.PERF_DATA_KEY + "*"

    (cr, keys) = await redis.scan(cursor=cr, match=m, count=batch)
    result = await redis.mget(keys)
    while cr:
        (cr, keys) = await redis.scan(cursor=cr, match=m, count=batch)
        points = await redis.mget(keys)
        result.extend(points)

    print(result[0])

    content = "[" + ",".join(result) + "]"
    return Response(content, media_type="application/json")
