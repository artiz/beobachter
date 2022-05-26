from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
import uvicorn
import asyncio

from app.api.base.routers.users import users_router
from app.api.base.routers.auth import auth_router
from app.api.base.routers.system import system_router
from app.core.config import settings
from app.db.session import SessionLocal
from app.core.auth import get_current_active_user
from app.core.celery_app import celery_app
from app.core import global_app

app = FastAPI(
    title=settings.PROJECT_NAME,
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


@app.on_event("startup")
async def app_startup():
    asyncio.ensure_future(global_app.startup())


@app.on_event("shutdown")
async def app_shutdown():
    asyncio.create_task(global_app.shutdown())


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get(settings.API)
async def root():
    return {"message": "Hello World"}


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
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=settings.PORT)
