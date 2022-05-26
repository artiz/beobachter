from fastapi import WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosed
from typing import List, Set

import redis
import asyncio


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._stopped = False

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        try:
            await websocket.close()
        except:
            ...

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

    def __init__(self, redis_url: str, channel: str):
        super().__init__()
        self.redis_url = redis_url
        self.channel = channel

    async def run(self):
        self.r = redis.Redis.from_url(
            self.redis_url, charset="utf-8", decode_responses=True
        )
        self.ps = self.r.pubsub()
        self.ps.subscribe([self.channel])

        while True:
            if self._stopped:
                break
            msg = self.ps.get_message()
            if msg and msg["type"] == "message":
                # text = msg["data"].decode("utf-8")
                await self.broadcast(msg["data"])
            await asyncio.sleep(0.5)

        self.ps.unsubscribe()
        self.r.close()

    async def stop(self):
        super().stop()
