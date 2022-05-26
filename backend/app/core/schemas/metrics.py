from typing import Optional
from pydantic import BaseModel


class PerfMetrics(BaseModel):
    cpu_perc: float  # percent
    vm_perc: float  # percent
    ts: int

    def __str__(self) -> None:
        return f"CPU%: {self.cpu_perc}, VM%: {self.vm_perc}"
