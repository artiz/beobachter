import React, { useEffect, useState } from "react";
import { usePerfMetricsState, IPerfMetrics } from "core/metrics/usePerfMetricsState";
// import LoadingCircle from "components/state/LoadingCircle";
import Widget from "components/widget/Widget";
import MetricsIndicator from "components/metrics/MetricsIndicator";
import MetricsChart from "components/metrics/MetricsChart";
import { APIClient } from "core/api/client";

const Monitoring = () => {
    const client = new APIClient();
    const [metrics, metricsLoading] = usePerfMetricsState();
    const [metricsHistory, setMetricsHistory] = useState<IPerfMetrics[]>([]);

    useEffect(() => {
        client.get<IPerfMetrics[]>("/system_metrics").then((res) => setMetricsHistory(res.data));
    }, []);

    useEffect(() => {
        if (metrics) {
            setMetricsHistory([...metricsHistory, metrics]);
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
                            data={metricsHistory}
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
                            data={metricsHistory}
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
