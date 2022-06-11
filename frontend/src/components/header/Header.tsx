import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import config from "core/config";
import UserMenu from "./UserMenu";
import HeaderLink from "./HeaderLink";
import SearchBox from "./SearchBox";
import { User } from "core/models/user";

interface HeaderProps {
    user: User;
}

function Header({ user }: HeaderProps) {
    const [showNav, setShowNav] = useState<boolean>(false);
    const toggleNav = useCallback(() => {
        setShowNav(!showNav);
    }, [showNav]);

    const handleSearch = useCallback(
        (query: string) => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank", "noopener");
        },
        [showNav]
    );

    const navBarCls = useMemo(
        () =>
            `w-full flex-grow lg:flex lg:items-center lg:w-auto ${
                showNav ? "block" : "hidden"
            } lg:block mt-2 lg:mt-0 bg-zinc-900 z-2`,
        [showNav]
    );

    return (
        <>
            <nav id="header" className="bg-zinc-900 fixed w-full z-10 top-0 border-b border-zinc-500">
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
                                <UserMenu user={user} />
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
                            <HeaderLink path="/home" title="Home" color="blue" icon="home" />
                            {user && (
                                <>
                                    <HeaderLink path="/monitoring" title="Monitoring" color="green" icon="chart-area" />
                                    <HeaderLink path="/users" title="Users" color="purple" icon="users" />
                                    <HeaderLink path="/tasks" title="Tasks" color="pink" icon="tasks" />
                                </>
                            )}
                        </ul>

                        <SearchBox onSearch={handleSearch} />
                    </div>
                </div>
            </nav>
            <div className="lg:pt-20 lg:mt-4 md:pt-16 pt-16"></div>
        </>
    );
}

export default Header;
