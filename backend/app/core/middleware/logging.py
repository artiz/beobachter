from starlette.types import ASGIApp, Receive, Scope, Send
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
