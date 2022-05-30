from fastapi import APIRouter, WebSocket, Depends, Response, status
from typing import List
import asyncio

from app.core.auth import (
    check_current_active_user,
    get_current_active_user,
    get_jwt_token_decoder,
)
from app.core.config import settings
from app.core.net.websocket import ConnectionManager
from app.api.dependencies.management import get_system_metrics_manager
from app.api.dependencies.common import get_redis, get_log
from app.core import util
from app.db import session

system_router = r = APIRouter()


@r.websocket("/ws_system_metrics")
async def ws_system_metrics(
    websocket: WebSocket,
    manager: ConnectionManager = Depends(get_system_metrics_manager),
    current_user=Depends(check_current_active_user),
    db=Depends(session.get_db),
    log=Depends(get_log),
    jwt_checker=Depends(get_jwt_token_decoder),
):
    """
    Websocket channel with system performance data updates
    """
    # manual connection close to avoid pool exhaustion
    db.close()
    if not current_user:
        await websocket.close(
            code=status.WS_1008_POLICY_VIOLATION, reason="auth_error"
        )
        return

    sock_id = await manager.connect(websocket)
    try:
        while True:
            if manager.stopped() or not manager.is_connected(sock_id):
                break
            await asyncio.sleep(0.5)
            jwt_checker(current_user.token)
    except Exception as ex:
        await log.error(ex)
    finally:
        await manager.disconnect(sock_id)


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

    content = "[" + ",".join(result) + "]"
    return Response(content, media_type="application/json")
