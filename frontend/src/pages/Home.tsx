import React from "react";
import Widget from "components/widget/Widget";
import config from "core/config";

const Home = () => {
    return (
        <div className="w-full flex flex-wrap flex-grow">
            <div className="flex flex-wrap flex-grow w-full">
                <Widget title={config.appName}>
                    <h1 className="text-xl font-bold pb-2">Intro</h1>
                    <article>
                        <p className="pt-2">
                            Project based on{" "}
                            <a
                                className="text-zinc-600 no-underline hover:text-zinc-100 hover:text-underline"
                                href="https://github.com/Buuntu/fastapi-react"
                            >
                                Buuntu/fastapi-react
                            </a>{" "}
                            project with following features:
                        </p>
                        <ul className="pl-5 list-disc">
                            <li>Celery periodic task example</li>
                            <li>Tailwind CSS with support if dynamic classes (check *.tailwind files)</li>
                            <li>WebSocket integration</li>
                            <li>Recharts integration</li>
                            <li>Basic UI Widgets system</li>
                        </ul>
                        <p className="pt-5 text-amber-700">Please login to get access to additional functionality</p>
                    </article>
                </Widget>
            </div>
            <div className="flex flex-wrap flex-grow w-full md:w-1/2">
                <Widget title="Widget 1" size="1/2" color="emerald">
                    <p>Widget content</p>
                </Widget>

                <Widget title="Widget 2" size="1/2" color="blue">
                    <p>Widget content</p>
                </Widget>
            </div>

            <div className="flex flex-wrap flex-grow w-full md:w-1/2">
                <Widget title="Table" size="1" color="amber">
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

export default Home;
