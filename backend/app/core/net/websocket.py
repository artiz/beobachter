from fastapi import WebSocket, status
from websockets.exceptions import ConnectionClosed
from starlette.websockets import WebSocketState
from typing import Dict, List, Optional, Set
from app.core.util import uuid4_fast, init_logger
import redis
import asyncio


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self._stopped = False

    async def connect(self, websocket: WebSocket) -> str:
        await websocket.accept()
        id = str(uuid4_fast())
        self.active_connections[id] = websocket
        return id

    async def disconnect(self, id: str):
        assert isinstance(id, str)
        websocket = self.active_connections.pop(id, None)
        if websocket:
            await websocket.close()

    def is_connected(self, id: str):
        return id in self.active_connections

    async def send_message(self, message: str, socket_id: str):
        # KeyError is expected when socket is not connected
        websocket = self.active_connections[socket_id]
        if websocket.client_state == WebSocketState.DISCONNECTED:
            return

        try:
            await websocket.send_text(message)
        except ConnectionClosed:
            await self.disconnect(socket_id)

    async def broadcast(self, message: str):
        await asyncio.gather(
            *map(
                lambda id: self.send_message(message, id),
                self.active_connections,
            )
        )

    def stopped(self):
        return self._stopped

    async def stop(self):
        self._stopped = True
        self.active_connections = []


class RedisBroadcaster(ConnectionManager):
    r: redis.Redis
    ps: redis.client.PubSub

    def __init__(self, redis_url: str, channel: str, type: str = None):
        super().__init__()
        self.redis_url = redis_url
        self.channel = channel
        self.type = type or channel
        self.log = init_logger(f"broadcaster::{channel}")

    async def run(self):
        self._stopped = False
        self.log.debug("run...")
        self.r = redis.Redis.from_url(
            self.redis_url, charset="utf-8", decode_responses=True
        )
        self.ps = self.r.pubsub()
        self.ps.subscribe([self.channel])

        while True:
            if self.stopped():
                break
            msg = self.ps.get_message()
            if msg and msg["type"] == "message":
                data = f'{{"type":"{self.type}", "data": {msg["data"]} }}'
                await self.broadcast(data)

            await asyncio.sleep(0.5)

        self.ps.unsubscribe()
        self.r.close()

    async def stop(self):
        await self.log.debug("stop...")
        await super().stop()
