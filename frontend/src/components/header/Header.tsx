import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import config from "core/config";
import { useAuthStatus } from "core/hooks/useAuthStatus";
import UserMenu from "./UserMenu";

function Header() {
    const [user, userLoading] = useAuthStatus();

    return (
        <>
            <nav id="header" className="bg-gray-900 fixed w-full z-10 top-0 shadow">
                <div className="w-full container mx-auto flex flex-wrap items-center mt-0 py-2 px-2 md:pb-1">
                    <div className="w-1/2 pl-2 md:pl-0">
                        <Link
                            className="text-gray-100 text-base xl:text-xl no-underline hover:no-underline font-bold"
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
                                        className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to={"/signup"}
                                        className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div
                        className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 bg-gray-900 z-20"
                        id="nav-content"
                    >
                        <ul className="list-reset lg:flex flex-1 items-center px-4 md:px-0">
                            {user && (
                                <>
                                    <li className="mr-6 my-2 md:my-0">
                                        <Link
                                            to={"/"}
                                            className="block py-1 md:py-3 pl-1 align-middle text-blue-400 no-underline hover:text-gray-100 border-b-2 border-blue-400 hover:border-blue-400"
                                        >
                                            <i className="mr-3 text-blue-400">
                                                <Icon icon={["fas", "home"]} />
                                            </i>
                                            <span className="pb-1 md:pb-0 text-sm">Dashboard</span>
                                        </Link>
                                    </li>
                                    <li className="mr-6 my-2 md:my-0">
                                        <a
                                            href={config.getPublicUrl("/tasks")}
                                            className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-pink-400"
                                        >
                                            <i className="mr-3">
                                                <Icon icon={["fas", "tasks"]} />
                                            </i>
                                            <span className="pb-1 md:pb-0 text-sm">Tasks</span>
                                        </a>
                                    </li>
                                    <li className="mr-6 my-2 md:my-0">
                                        <a
                                            href={config.getPublicUrl("/messages")}
                                            className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-purple-400"
                                        >
                                            <i className="mr-3">
                                                <Icon icon={["fas", "envelope"]} />
                                            </i>
                                            <span className="pb-1 md:pb-0 text-sm">Messages</span>
                                        </a>
                                    </li>
                                    <li className="mr-6 my-2 md:my-0">
                                        <a
                                            href={config.getPublicUrl("/reports")}
                                            className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-green-400"
                                        >
                                            <i className="mr-3">
                                                <Icon icon={["fas", "chart-area"]} />
                                            </i>
                                            <span className="pb-1 md:pb-0 text-sm">Reports</span>
                                        </a>
                                    </li>
                                    <li className="mr-6 my-2 md:my-0">
                                        <a
                                            href={config.getPublicUrl("/payments")}
                                            className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-red-400"
                                        >
                                            <i className="mr-3">
                                                <Icon icon={["fas", "wallet"]} />
                                            </i>
                                            <span className="pb-1 md:pb-0 text-sm">Payments</span>
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>

                        <div className="relative pull-right pl-4 pr-4 md:pr-0">
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal"
                            />
                            <div className="absolute search-icon" style={{ top: "0.375rem", left: "1.75rem" }}>
                                <svg
                                    className="fill-current pointer-events-none text-gray-500 w-4 h-4"
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
            <div className="lg:pt-20 lg:mt-10 md:pt-16 pt-16"></div>
        </>
    );
}

export default Header;
