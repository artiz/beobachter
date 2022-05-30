from typing import Optional
from pydantic import BaseModel


class PerfMetrics(BaseModel):
    cpu_p: float  # percent
    vm_p: float  # percent
    ts: int

    def __str__(self) -> None:
        return f"CPU%: {self.cpu_p}, VM%: {self.vm_p}"


PerfMetrics.Keys = ["cpu_p", "vm_p"]
