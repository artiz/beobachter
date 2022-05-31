import logging
import celery.signals
from app.core.celery_app import celery_app
from celery.utils.log import get_logger, get_task_logger
from app.core.metrics.performance import PerfMetricsLoader
from app.core.config import settings

logger = get_task_logger(__name__)
perf_metrics_loader = PerfMetricsLoader()


@celery_app.task(acks_late=True)
async def example_task(word: str) -> str:
    return f"test task returns {word}"


@celery_app.task()
def perf_metrics_load() -> int:
    try:
        perf_metrics_loader.load()
    except Exception as e:
        logger.exception("perf_metrics_load failed", e)


# Configure celery beat
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    try:
        task_log = logging.getLogger("celery.task")
        task_log.addHandler(logging.StreamHandler())
    except Exception as e:
        print("ERROR: setup_periodic_tasks, log setup failed", e)

    try:
        perf_metrics_loader.init()
        sender.add_periodic_task(settings.PERF_METRICS_LOAD_INTERVAL, perf_metrics_load.s(), name="Get perf metrics")
    except Exception as e:
        logger.exception("setup_periodic_tasks failed", e)
