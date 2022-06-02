import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import config from "core/config";
import { useAuthStatus } from "core/hooks/useAuthStatus";
import UserMenu from "./UserMenu";
import HeaderLink from "./HeaderLink";

function Header() {
    const [user, userLoading] = useAuthStatus();
    const [showNav, setShowNav] = useState<boolean>(false);
    const toggleNav = useCallback(() => {
        setShowNav(!showNav);
    }, [showNav]);

    const navBarCls = useMemo(
        () =>
            `w-full flex-grow lg:flex lg:items-center lg:w-auto ${
                showNav ? "block" : "hidden"
            } lg:block mt-2 lg:mt-0 bg-zinc-900 z-2`,
        [showNav]
    );

    return (
        <>
            <nav id="header" className="bg-zinc-900 fixed w-full z-50 top-0 border-b border-zinc-500">
                <div className="w-full container mx-auto flex flex-wrap items-center mt-0 py-2 px-2 md:pb-1">
                    <div className="w-1/2 pl-2 md:pl-0">
                        <Link
                            className="text-zinc-100 text-base xl:text-xl no-underline hover:no-underline font-bold"
                            to="/"
                        >
                            {config.appName}
                        </Link>
                    </div>
                    <div className="w-1/2 pr-0">
                        <div className="text-sm flex relative inline-block float-right">
                            {user ? (
                                <UserMenu />
                            ) : userLoading ? (
                                <span>&nbsp;</span>
                            ) : (
                                <>
                                    <Link
                                        to={"/login"}
                                        className="px-4 py-2 block text-zinc-100 hover:bg-zinc-800 no-underline hover:no-underline"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to={"/signup"}
                                        className="px-4 py-2 block text-zinc-100 hover:bg-zinc-800 no-underline hover:no-underline"
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}
                            <div className="block lg:hidden pr-4 ml-2">
                                <button
                                    onClick={toggleNav}
                                    className={`flex items-center px-3 py-2 border rounded text-zinc-500 border-zinc-600 ${
                                        showNav ? "bg-zinc-600" : ""
                                    } hover:text-zinc-100 hover:border-zinc-500`}
                                >
                                    <Icon icon={["fas", "bars"]} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={navBarCls}>
                        <ul className="list-reset lg:flex flex-1 items-center px-4 md:px-0">
                            <>
                                <HeaderLink path="/home" title="Home" color="blue" icon="home" />
                            </>
                            {user && (
                                <>
                                    <HeaderLink path="/monitoring" title="Monitoring" color="green" icon="chart-area" />
                                    <HeaderLink path="/users" title="Users" color="purple" icon="users" />
                                    <HeaderLink path="/tasks" title="Tasks" color="pink" icon="tasks" />
                                </>
                            )}
                        </ul>

                        <div className="relative pull-right pl-4 pr-4 md:pr-0">
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full bg-zinc-900 text-sm text-zinc-400 placeholder-zinc-600 transition border border-zinc-800 outline-none focus:outline rounded py-1 px-2 pl-10"
                            />
                            <div className="absolute search-icon" style={{ top: "0.375rem", left: "1.75rem" }}>
                                <svg
                                    className="fill-current pointer-events-none text-zinc-500 w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="lg:pt-20 lg:mt-4 md:pt-16 pt-16"></div>
        </>
    );
}

export default Header;
