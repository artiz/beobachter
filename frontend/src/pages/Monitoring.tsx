import React, { useEffect, useState } from "react";
import { usePerfMetricsState } from "core/metrics/usePerfMetricsState";
import Widget from "components/widget/Widget";
import MetricsIndicator from "components/metrics/MetricsIndicator";
import MetricsChart from "components/metrics/MetricsChart";
import { APIClient } from "core/api/client";
import { NumDictionary } from "types/common";

type RawMetrics = [number, string][];
const STEP = 1_000; // ms

const Monitoring = () => {
    const client = new APIClient();
    const [metrics, metricsLoading] = usePerfMetricsState();
    const [cpuHistory, setCpuHistory] = useState<NumDictionary[]>([]);
    const [vmHistory, setVmHistory] = useState<NumDictionary[]>([]);

    useEffect(() => {
        client.get<RawMetrics>("/system/metrics/cpu_p").then((res) => setCpuHistory(parseMetrics(res.data, "cpu_p")));
        client.get<RawMetrics>("/system/metrics/vm_p").then((res) => setVmHistory(parseMetrics(res.data, "vm_p")));
    }, []);

    useEffect(() => {
        if (metrics) {
            const lastTs = cpuHistory?.at(-2)?.ts;
            const point = { cpu_p: metrics.cpu_p ?? 0, vm_p: metrics.vm_p ?? 0, ts: metrics.ts };
            if (lastTs) {
                if (metrics.ts - lastTs > STEP) {
                    setCpuHistory([...cpuHistory, point]);
                    setVmHistory([...vmHistory, point]);
                } else {
                    setCpuHistory([...cpuHistory.slice(0, cpuHistory.length - 1), point]);
                    setVmHistory([...vmHistory.slice(0, vmHistory.length - 1), point]);
                }
            } else {
                setCpuHistory([point]);
                setVmHistory([point]);
            }
        }
    }, [metrics]);

    return (
        <div className="w-full flex flex-wrap flex-grow">
            <div className="flex flex-wrap flex-grow w-full">
                <Widget size="1/2">
                    <MetricsIndicator
                        title="CPU %"
                        value={metrics?.cpu_p}
                        loading={metricsLoading}
                        icon="microchip"
                        iconColor="green"
                    ></MetricsIndicator>
                </Widget>

                <Widget size="1/2">
                    <MetricsIndicator
                        title="VM %"
                        value={metrics?.vm_p}
                        loading={metricsLoading}
                        icon="memory"
                        iconColor="red"
                    ></MetricsIndicator>
                </Widget>

                <Widget title="CPU" size="1/2" icon="microchip" iconColor="green">
                    <div className="h-[300px] text-xs w-full">
                        <MetricsChart data={cpuHistory} title="CPU %" field="cpu_p" lineColor="#10b981" />
                    </div>
                </Widget>

                <Widget title="Virtual Memory" size="1/2" icon="memory" iconColor="red">
                    <div className="h-[300px] text-xs">
                        <MetricsChart data={vmHistory} title="VM %" field="vm_p" lineColor="#ef4444" />
                    </div>
                </Widget>
            </div>
        </div>
    );
};

export default Monitoring;

function parseMetrics(data: RawMetrics, metric: "cpu_p" | "vm_p"): NumDictionary[] {
    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(([ts, value]) => ({
        ts: ts,
        [metric]: +parseFloat(value).toPrecision(2),
    }));
}
