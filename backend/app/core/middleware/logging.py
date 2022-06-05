import time
from fastapi import Request
from starlette.types import ASGIApp, Receive, Scope, Send
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from app.core import util
from aiologger.levels import LogLevel


class RequestLogMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app
        self.log = util.init_logger("req")

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ["http", "websocket"]:
            return await self.app(scope, receive, send)

        if not self.log.is_enabled_for(LogLevel.INFO):
            return await self.app(scope, receive, send)

        self.log.info(
            "{} {} {}".format(
                scope["type"],
                scope.get("method", "-"),
                scope["path"],
            ),
        )
        await self.app(scope, receive, send)


class ProcessTimeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app, dispatch=self.dispatch)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> None:
        if request.scope["type"] != "http":
            return await call_next(request)

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response
