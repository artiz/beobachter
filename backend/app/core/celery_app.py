from celery import Celery
from app.core.config import settings


celery_app = Celery("worker", broker=settings.CELERY_BROKER)

celery_app.conf.task_routes = {"app.tasks.*": "main-queue"}
