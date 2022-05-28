from celery import Celery
from app.core.config import settings
import celery

celery_app = Celery("worker", broker=settings.CELERY_BROKER)

celery_app.conf.task_routes = {"app.tasks.*": "main-queue"}
