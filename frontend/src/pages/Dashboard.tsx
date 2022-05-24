import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { usePerfMetricsState } from "core/metrics/usePerfMetricsState";
import Button from "components/button/Button";
import LoadingCircle from "components/state/LoadingCircle";

const Dashboard = () => {
    const [metrics] = usePerfMetricsState();

    return (
        <div className="w-full px-4 mt-0 mb-16 text-gray-800 leading-normal">
            {/* Console Content */}

            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                    <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="rounded p-3 bg-green-600">
                                    <Icon icon={["fas", "microchip"]} inverse={true} size="2x" />
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h5 className="font-bold uppercase text-gray-400">CPU %</h5>
                                <h3 className="font-bold text-3xl text-gray-600">
                                    {metrics?.cpu_perc ?? (
                                        <div className="flex items-center">
                                            <LoadingCircle height="h-6" width="w-full" />
                                        </div>
                                    )}{" "}
                                    {metrics?.cpu_perc && (
                                        <span className="text-green-500">
                                            <i>
                                                <Icon icon={["fas", "percent"]} />
                                            </i>
                                        </span>
                                    )}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                    <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="rounded p-3 bg-pink-600">
                                    <i>
                                        <Icon icon={["fas", "memory"]} inverse={true} size="2x" />
                                    </i>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h5 className="font-bold uppercase text-gray-400">VM %</h5>
                                <h3 className="font-bold text-3xl text-gray-600">
                                    {metrics?.vm_perc ?? (
                                        <div className="flex items-center">
                                            <LoadingCircle height="h-6" width="w-full" />
                                        </div>
                                    )}
                                    {/* {" "}
                            <span className="text-pink-500">
                                <i>
                                    <Icon icon={["fas", "exchange-alt"]} />
                                </i>
                            </span> */}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row flex-wrap flex-grow mt-2">
                <div className="w-full md:w-1/2 p-3">
                    <div className="bg-gray-900 border border-gray-800 rounded shadow">
                        <div className="border-b border-gray-800 p-3">
                            <h5 className="font-bold uppercase text-gray-600">Buttons</h5>
                        </div>
                        <div className="p-5">
                            <Button title="Outlined" />
                            <Button title="Default" isDefault={true} />
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-3">
                    <div className="bg-gray-900 border border-gray-800 rounded shadow">
                        <div className="border-b border-gray-800 p-3">
                            <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                        </div>
                        <div className="p-5">
                            <canvas id="chartjs-0" className="chartjs" width="undefined" height="undefined"></canvas>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                    <div className="bg-gray-900 border border-gray-800 rounded shadow">
                        <div className="border-b border-gray-800 p-3">
                            <h5 className="font-bold uppercase text-gray-600">Template</h5>
                        </div>
                        <div className="p-5"></div>
                    </div>
                </div>

                <div className="w-full p-3">
                    <div className="bg-gray-900 border border-gray-800 rounded shadow">
                        <div className="border-b border-gray-800 p-3">
                            <h5 className="font-bold uppercase text-gray-600">Table</h5>
                        </div>
                        <div className="p-5">
                            <table className="w-full p-5 text-gray-700">
                                <thead>
                                    <tr>
                                        <th className="text-left text-gray-600">Name</th>
                                        <th className="text-left text-gray-600">Side</th>
                                        <th className="text-left text-gray-600">Role</th>
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

                            <p className="py-2">
                                <a href="#" className="text-white">
                                    See More issues...
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
