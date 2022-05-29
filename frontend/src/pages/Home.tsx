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
                                className="text-zinc-600 no-underline hover:text-zinc-100 hover:underline"
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
            <div className="flex flex-wrap flex-grow w-full">
                <Widget title="API" size="1/4" color="emerald">
                    <p>
                        Default Documentation:{" "}
                        <a
                            className="text-emerald-600 hover:text-emerald-100 hover:underline"
                            href={config.apiBasePath + "/docs"}
                        >
                            /docs
                        </a>
                    </p>
                    <p>
                        Alternative Documentation:{" "}
                        <a
                            className="text-emerald-600 hover:text-emerald-100 hover:underline"
                            href={config.apiBasePath + "/redoc"}
                        >
                            /redoc
                        </a>
                    </p>
                </Widget>

                <Widget title="UI Components" size="3/4" color="blue">
                    <p>Widget content</p>
                </Widget>
            </div>
        </div>
    );
};

export default Home;
