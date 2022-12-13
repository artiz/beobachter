import logging
import sys
import random
from uuid import UUID
from app.core.config import settings
from aiologger.loggers.json import JsonLogger
from aiologger import Logger
from aiologger.formatters.base import Formatter
from aiologger.utils import CallableWrapper

rnd = random.SystemRandom()


def uuid4_fast():
    return UUID(int=rnd.getrandbits(k=128), version=4)


def init_logger(name: str = "app", json_format: bool = False):
    if json_format:
        log = JsonLogger.with_default_handlers(name=name, flatten=True, level=settings.LOG_LEVEL)
    else:
        fmt = Formatter("%(levelname)-9s [%(name)s] %(message)s")
        log = Logger.with_default_handlers(name=name, level=settings.LOG_LEVEL, formatter=fmt)

    log.wrapper = CallableWrapper
    return log
