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
from app.api.dependencies.common import get_metrics_service, get_redis, get_log
from app.core import util
from app.db.session import get_db
from app.core.schemas.metrics import PerfMetrics

system_router = r = APIRouter()


@r.websocket("/ws_system_metrics")
async def ws_system_metrics(
    websocket: WebSocket,
    manager: ConnectionManager = Depends(get_system_metrics_manager),
    user_data=Depends(check_current_active_user),
    db=Depends(get_db),
    log=Depends(get_log),
    jwt_checker=Depends(get_jwt_token_decoder),
):
    """
    Websocket channel with system performance data updates
    """
    # manual connection close to avoid pool exhaustion
    await db.close()
    [current_user, token] = user_data
    if not current_user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="auth_error")
        return

    sock_id = await manager.connect(websocket)
    try:
        while True:
            if manager.stopped() or not manager.is_connected(sock_id):
                break
            await asyncio.sleep(0.5)
            jwt_checker(token)
    except Exception as ex:
        await log.error(ex)
    finally:
        await manager.disconnect(sock_id)


@r.get("/system_metrics/{metric}")  # , response_model=List[PerfMetrics]
async def system_metrics(
    metrics_svc=Depends(get_metrics_service),
    current_user=Depends(get_current_active_user),
    metric: Optional[str] = "cpu_p",
):
    """
    Get system performance data
    """
    points = await metrics_svc.get_metrics(metric)

    return points
