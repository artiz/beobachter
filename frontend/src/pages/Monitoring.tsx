import React, { useEffect, useState } from "react";
import { usePerfMetricsState, IPerfMetrics } from "core/metrics/usePerfMetricsState";
// import LoadingCircle from "components/state/LoadingCircle";
import Widget from "components/widget/Widget";
import MetricsIndicator from "components/metrics/MetricsIndicator";
import MetricsChart from "components/metrics/MetricsChart";
import { APIClient } from "core/api/client";

type RawMetrics = [number, string][];

const Monitoring = () => {
    const client = new APIClient();
    const [metrics, metricsLoading] = usePerfMetricsState();
    const [cpuHistory, setCpuHistory] = useState<IPerfMetrics[]>([]);
    const [vmHistory, setVmHistory] = useState<IPerfMetrics[]>([]);

    useEffect(() => {
        client
            .get<RawMetrics>("/system_metrics/cpu_p", { skipErrorCheck: true })
            .then((res) => setCpuHistory(parseMetrics(res.data, "cpu_p")));
        client
            .get<RawMetrics>("/system_metrics/vm_p", { skipErrorCheck: true })
            .then((res) => setVmHistory(parseMetrics(res.data, "vm_p")));
    }, []);

    useEffect(() => {
        if (metrics) {
            setCpuHistory([...cpuHistory, { cpu_p: metrics.cpu_p, ts: metrics.ts }]);
            setVmHistory([...vmHistory, { vm_p: metrics.vm_p, ts: metrics.ts }]);
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
                        <MetricsChart
                            data={cpuHistory}
                            title="CPU %"
                            field="cpu_p"
                            lineColor="#10b981"
                            yRange={[0, 100]}
                        />
                    </div>
                </Widget>

                <Widget title="Virtual Memory" size="1/2" icon="memory" iconColor="red">
                    <div className="h-[300px] text-xs">
                        <MetricsChart
                            data={vmHistory}
                            title="VM %"
                            field="vm_p"
                            lineColor="#ef4444"
                            yRange={[0, 100]}
                        />
                    </div>
                </Widget>
            </div>
        </div>
    );
};

export default Monitoring;

function parseMetrics(data: RawMetrics, metric: "cpu_p" | "vm_p"): IPerfMetrics[] {
    if (!data) {
        return [];
    }

    return data.map(([ts, value]) => ({
        ts: ts,
        [metric]: parseFloat(value).toPrecision(2),
    }));
}
