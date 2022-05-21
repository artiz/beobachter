import React, { useEffect, useState } from "react";
// import { ReactComponent as Logo } from "images/logo.svg";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import Header from "components/header/Header";
import "App.css";

interface PerfMetrics {
    cpu_perc: number;
    vm_perc: number;
    ts: number;
}

function App() {
    const [metrics, setMetrics] = useState<PerfMetrics>();

    useEffect(() => {
        const basePath = SERVER_DATA.wsBasePath;

        const ws = new WebSocket(`${basePath}/ws_system_metrics`);
        ws.onmessage = (event) => {
            // console.log("ws_system_metrics", event.data);
            setMetrics(JSON.parse(event.data));
        };

        // ws.send("init");
        return () => {
            // ws.close();
        };
    }, []);

    return (
        <>
            <Header />
            {/* Container */}
            <div className="container w-full mx-auto pt-20">
                <div className="w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal">
                    {/* Console Content */}

                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
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
                                            {metrics?.cpu_perc ?? "N/A"}
                                            {/* {" "}<span className="text-green-500">
                                                <i>
                                                    <Icon icon={["fas", "caret-up"]} />
                                                </i>
                                            </span> */}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
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
                                            {metrics?.vm_perc ?? "N/A"}
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

                    <hr className="border-b-2 border-gray-600 my-8 mx-4" />

                    <div className="flex flex-row flex-wrap flex-grow mt-2">
                        <div className="w-full md:w-1/2 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-7"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-0"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-1"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-4"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
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
            </div>
            <footer className="bg-gray-900 border-t border-gray-400 shadow">
                <div className="container max-w-md mx-auto flex py-8">
                    <div className="w-full mx-auto flex flex-wrap">
                        <div className="flex w-full md:w-1/2 ">
                            <div className="px-8">
                                <h3 className="font-bold font-bold text-gray-100">About</h3>
                                <p className="py-4 text-gray-600 text-sm">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mi ut felis
                                    tempus commodo nec id erat. Suspendisse consectetur dapibus velit ut lacinia.
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full md:w-1/2">
                            <div className="px-8">
                                <h3 className="font-bold font-bold text-gray-100">Social</h3>
                                <ul className="list-reset items-center text-sm pt-3">
                                    <li>
                                        <a
                                            className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                            href="#"
                                        >
                                            Add social link
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                            href="#"
                                        >
                                            Add social link
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                            href="#"
                                        >
                                            Add social link
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default App;
