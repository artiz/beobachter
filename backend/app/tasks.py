import logging
from app.core.celery_app import celery_app
from celery.utils.log import get_logger, get_task_logger
from app.core.metrics.performance import PerfMetricsLoader
from app.core.config import settings

perf_metrics_loader = PerfMetricsLoader()


@celery_app.task(acks_late=True)
def example_task(word: str) -> str:
    return f"test task returns {word}"


@celery_app.task()
def perf_metrics_load() -> int:
    logger = get_task_logger(__name__)
    try:
        perf_metrics_loader.load()
    except Exception as e:
        logger.exception("perf_metrics_load failed", e)


# Configure celery beat
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    try:
        perf_metrics_loader.init()
        sender.add_periodic_task(settings.PERF_METRICS_LOAD_INTERVAL, perf_metrics_load.s(), name="Get perf metrics")
    except Exception as e:
        print("[ERROR] setup_periodic_tasks failed", e)
