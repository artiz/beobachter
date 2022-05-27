from contextlib import suppress
from fastapi import WebSocket, status
from websockets.exceptions import ConnectionClosed
from typing import List, Optional, Set

import redis
import asyncio


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._stopped = False

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def process_auth_error(self, websocket: WebSocket):
        try:
            await websocket.close(
                code=status.WS_1008_POLICY_VIOLATION, reason="auth_error"
            )
        finally:
            with suppress(ValueError):
                self.active_connections.remove(websocket)

    async def disconnect(self, websocket: WebSocket):
        try:
            await websocket.close()
        finally:
            with suppress(ValueError):
                self.active_connections.remove(websocket)

    def stopped(self):
        return self._stopped

    async def send_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except ConnectionClosed:
            await self.disconnect(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await self.send_message(message, connection)

    def stop(self):
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

    async def run(self):
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
