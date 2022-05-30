from app.core.celery_app import celery_app
from celery.utils.log import get_task_logger
from app.core.metrics.performance import PerfMetricsLoader
from app.core.config import settings


logger = get_task_logger(__name__)
perf_loader = PerfMetricsLoader()


@celery_app.task(acks_late=True)
def example_task(word: str) -> str:
    return f"test task returns {word}"


@celery_app.task()
def perf_metrics() -> int:
    try:
        perf_loader.load()
    except Exception as e:
        logger.error("perf_metrics failed", e)


# Configure celery beat
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(settings.PERF_DATA_INTERVAL, perf_metrics.s(), name="Get perf metrics")
