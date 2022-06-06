import uvicorn
import asyncio
from fastapi import FastAPI, Depends, Request, WebSocket, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import http_exception_handler
from starlette.responses import JSONResponse


from app.api.base.routers.users import users_router
from app.api.base.routers.auth import auth_router
from app.api.base.routers.system import system_router
from app.core.config import settings
from app.db.session import session
from app.core.net.auth import get_current_active_user
from app.core.celery_app import celery_app
from app.core import global_app, util
from app.core.middleware.logging import RequestLogMiddleware, ProcessTimeMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url=f"{settings.API}/docs",
    redoc_url=f"{settings.API}/redoc",
    openapi_url=f"{settings.API}/openapi",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_origin_regex=settings.BACKEND_CORS_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


startup_task = None
log = util.init_logger("app")


@app.on_event("startup")
async def app_startup():
    global startup_task
    log.info("app startup...")
    startup_task = asyncio.ensure_future(global_app.startup())


@app.on_event("shutdown")
async def app_shutdown():
    startup_task.cancel()
    asyncio.create_task(global_app.shutdown())


app.add_middleware(RequestLogMiddleware)
# app.add_middleware(ProcessTimeMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.exception(exc)
    if isinstance(exc, HTTPException):
        return await http_exception_handler(request, exc)

    return JSONResponse({"error": str(exc)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@app.get(settings.API)
async def root():
    return {"app": settings.PROJECT_NAME, "version": settings.VERSION}


@app.get(f"{settings.API}/task")
async def example_task():
    celery_app.send_task("app.tasks.example_task", args=["Hello World"])

    return {"message": "success"}


# Routers
app.include_router(
    users_router,
    prefix=settings.API,
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(auth_router, prefix=settings.API + "/auth", tags=["auth"])
app.include_router(system_router, prefix=settings.API, tags=["system"])


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        log_level="critical",
        reload=True,
        port=settings.PORT,
    )
