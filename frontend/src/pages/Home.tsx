import React from "react";
import config from "core/config";
import { Menu, MenuItem, MenuSeparator } from "components/dropdown";
import Button from "components/button/Button";
import { ThailwindColor, ThailwindColorStr } from "ui/thailwind";
import { AuthContext } from "core/hooks/useAuthStatus";
import Widget from "components/widget/Widget";
import WidgetLink from "components/widget/WidgetLink";
import Alert from "components/state/Alert";

const Home = () => {
    return (
        <div className="w-full flex flex-wrap flex-grow">
            <div className="flex flex-wrap flex-grow w-full">
                <Widget size="3/4" title={config.appName}>
                    <h1 className="text-xl font-bold pb-2 text-emerald-600">Intro</h1>
                    <article>
                        <p className="pt-2">
                            Project based on{" "}
                            <WidgetLink href="https://github.com/Buuntu/fastapi-react">Buuntu/fastapi-react</WidgetLink>{" "}
                            project with following features:
                        </p>
                        <h2 className="font-bold py-1 text-emerald-600">Backend</h2>

                        <ul className="pl-5 list-disc">
                            <li>
                                <WidgetLink href="https://www.sqlalchemy.org/">SQLAlchemy 1.4</WidgetLink> with Alembic
                                for migrations and{" "}
                                <WidgetLink href="https://docs.sqlalchemy.org/en/14/orm/extensions/asyncio.html">
                                    asynchronous I/O
                                </WidgetLink>{" "}
                                (asyncio) support
                            </li>
                            <li>Celery periodic task example</li>
                            <li>
                                <WidgetLink href="/monitoring">WebSocket integration</WidgetLink> with token
                                authentication
                            </li>
                        </ul>
                        <h2 className="font-bold py-1 text-emerald-600">Frontend</h2>
                        <ul className="pl-5 list-disc">
                            <li>
                                <WidgetLink href="https://tailwindcss.com/">Tailwind CSS</WidgetLink> with support of
                                dynamic classes (check *.tailwind files)
                            </li>
                            <li>
                                <WidgetLink href="https://recharts.org/">Recharts</WidgetLink>{" "}
                                <WidgetLink href="/monitoring">integration</WidgetLink>
                            </li>
                            <li>Basic UI Widgets system</li>
                        </ul>

                        <AuthContext.Consumer>
                            {(user) =>
                                user ? null : (
                                    <p className="pt-5 text-amber-700">
                                        Please <WidgetLink href="/login">login</WidgetLink> to get access to additional
                                        functionality
                                    </p>
                                )
                            }
                        </AuthContext.Consumer>
                    </article>
                </Widget>
                <Widget title="API" size="1/4" color="emerald">
                    <p>
                        Default Documentation:{" "}
                        <WidgetLink color="emerald" href={config.apiBasePath + "/docs"}>
                            /docs
                        </WidgetLink>
                    </p>
                    <p>
                        Alternative Documentation:{" "}
                        <WidgetLink color="emerald" href={config.apiBasePath + "/redoc"}>
                            /redoc
                        </WidgetLink>
                    </p>
                </Widget>
            </div>
            <div className="flex flex-wrap flex-grow w-full">
                <Widget title="UI Components" size="1/2" color="zinc">
                    <section className="p-2 border border-indigo-200">
                        Dropdown:{" "}
                        <Menu label="Edit" color="slate" hovercolor="emerald">
                            <MenuItem label="Undo" icon="undo" />
                            <MenuItem label="Redo" icon="redo" />
                            <MenuItem label="Cut" disabled />
                            <MenuSeparator />
                            <Menu label="Copy as">
                                <MenuItem label="Text" />
                                <MenuItem label="Video" />
                                <Menu label="Image">
                                    <MenuItem label=".png" />
                                    <MenuItem label=".jpg" />
                                    <MenuItem label=".svg" />
                                    <MenuItem label=".gif" />
                                </Menu>
                                <MenuItem label="Audio" />
                            </Menu>
                            <Menu label="Share">
                                <MenuItem label="Mail" />
                                <MenuItem label="Instagram" />
                            </Menu>
                        </Menu>
                    </section>
                    <section className="p-2 mt-4 border border-indigo-200">
                        Buttons:{" "}
                        <Button type="submit" color="slate">
                            Submit
                        </Button>
                        <Button color="slate" outline={true}>
                            Outline
                        </Button>
                        <hr className="my-4 border-indigo-200" />
                        {Object.keys(ThailwindColor)
                            .filter((k) => Number.isNaN(+k))
                            .map((color) => (
                                <Button
                                    color={color as ThailwindColorStr}
                                    key={color}
                                    className="capitalize"
                                    inline={false}
                                >
                                    {color}
                                </Button>
                            ))}
                    </section>
                </Widget>
                <Widget title="Alert" size="1/2" color="zinc">
                    <Alert
                        color="orange"
                        icon="asterisk"
                        title="Title"
                        onClose={() => {
                            return void 0;
                        }}
                    >
                        Orange
                    </Alert>

                    <Alert color="pink" icon="bell" title="Pink!">
                        This is a pink alert - check it out!
                    </Alert>
                </Widget>
            </div>
        </div>
    );
};

export default Home;
