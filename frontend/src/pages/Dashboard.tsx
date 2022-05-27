import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { usePerfMetricsState } from "core/metrics/usePerfMetricsState";
import LoadingCircle from "components/state/LoadingCircle";
import Widget from "components/widget/Widget";
import MetricsIndicator from "components/metrics/MetricsIndicator";

const Dashboard = () => {
    const [metrics, metricsLoading] = usePerfMetricsState();

    return (
        <div className="w-full flex flex-wrap flex-grow">
            {/* Console Content */}

            <div className="flex flex-wrap flex-grow w-full md:w-1/2">
                <Widget size="1/2">
                    <MetricsIndicator
                        title="CPU %"
                        value={metrics?.cpu_perc}
                        loading={metricsLoading}
                        icon="microchip"
                        iconColor="green"
                    ></MetricsIndicator>
                </Widget>

                <Widget size="1/2">
                    <MetricsIndicator
                        title="VM %"
                        value={metrics?.vm_perc}
                        loading={metricsLoading}
                        icon="memory"
                        iconColor="red"
                    ></MetricsIndicator>
                </Widget>

                <Widget title="CPU" size="1/2" icon="microchip" iconColor="green">
                    <canvas id="chartjs-0" className="chartjs" width="undefined" height="undefined"></canvas>
                </Widget>
                <Widget title="Virtual Memory" size="1/2" icon="memory" iconColor="red">
                    <canvas id="chartjs-0" className="chartjs" width="undefined" height="undefined"></canvas>
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
