import React, { useEffect, useState } from "react";
import { usePerfMetricsState, IPerfMetrics } from "core/metrics/usePerfMetricsState";
// import LoadingCircle from "components/state/LoadingCircle";
import Widget from "components/widget/Widget";
import MetricsIndicator from "components/metrics/MetricsIndicator";
import MetricsChart from "components/metrics/MetricsChart";
import { APIClient } from "core/api/client";

const Dashboard = () => {
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
            {/* Console Content */}

            <div className="flex flex-wrap flex-grow w-full md:w-1/2">
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

            <div className="flex flex-wrap flex-grow w-full md:w-1/2">
                <Widget title="Table" size="1" color="blue">
                    <table className="w-full p-5">
                        <thead>
                            <tr>
                                <th className="text-left">Name</th>
                                <th className="text-left">Side</th>
                                <th className="text-left">Role</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Obi Wan Kenobi</td>
                                <td>Light</td>
                                <td>Jedi</td>
                            </tr>
                            <tr>
                                <td>Greedo</td>
                                <td>South</td>
                                <td>Scumbag</td>
                            </tr>
                            <tr>
                                <td>Darth Vader</td>
                                <td>Dark</td>
                                <td>Sith</td>
                            </tr>
                        </tbody>
                    </table>
                </Widget>
            </div>
        </div>
    );
};

export default Dashboard;
