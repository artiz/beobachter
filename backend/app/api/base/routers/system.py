from fastapi import APIRouter, WebSocket, Depends, Response, HTTPException, status
from typing import List, Optional
import asyncio

from app.core.net.auth import (
    check_current_active_user,
    get_current_active_user,
    get_jwt_token_decoder,
)
from app.core.config import settings
from app.core.net.websocket import ConnectionManager
from app.api.dependencies.management import get_system_metrics_manager
from app.api.dependencies.common import get_redis, get_log
from app.core import util
from app.db.session import get_db
from app.core.schemas.metrics import PerfMetrics

system_router = r = APIRouter()


@r.websocket("/ws_system_metrics")
async def ws_system_metrics(
    websocket: WebSocket,
    manager: ConnectionManager = Depends(get_system_metrics_manager),
    current_user=Depends(check_current_active_user),
    db=Depends(get_db),
    log=Depends(get_log),
    jwt_checker=Depends(get_jwt_token_decoder),
):
    """
    Websocket channel with system performance data updates
    """
    # manual connection close to avoid pool exhaustion
    await db.close()
    if not current_user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="auth_error")
        return

    sock_id = await manager.connect(websocket)
    try:
        while True:
            if manager.stopped() or not manager.is_connected(sock_id):
                break
            await asyncio.sleep(0.5)

            # TODO: complete
            # user_session = Depends(check_current_active_user)
            # ... (user, token) = user_session
            # jwt_checker(token)
    except Exception as ex:
        await log.error(ex)
    finally:
        await manager.disconnect(sock_id)


@r.get("/system_metrics/{metric}")  # , response_model=List[PerfMetrics]
async def system_metrics(
    redis=Depends(get_redis),
    current_user=Depends(get_current_active_user),
    metric: Optional[str] = "cpu_p",
):
    """
    Get with system performance data
    """

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
