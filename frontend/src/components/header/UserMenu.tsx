import React, { useCallback, useMemo, useState } from "react";
// import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import { useAuthStatus } from "core/hooks/useAuthStatus";
import PopupMenu from "components/menu/PopupMenu";
import LinkMenuItem from "components/menu/LinkMenuItem";

function UserMenu() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, _, doLogout] = useAuthStatus();
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

    const handleMenuClick = useCallback(() => setShowUserMenu(!showUserMenu), [showUserMenu]);
    const userName = useMemo(() => user?.firstName || user?.email || "Profile", [user]);

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="relative text-gray-100">
                <button id="userButton" onClick={handleMenuClick} className="flex items-center focus:outline-none mr-3">
                    <img className="w-8 h-8 rounded-full mr-4" src="http://i.pravatar.cc/300" alt="Avatar of User" />{" "}
                    <span className="hidden md:inline-block text-gray-100">{userName}</span>
                    <svg
                        className="pl-2 h-2 fill-current text-gray-100"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 129 129"
                        enableBackground="new 0 0 129 129"
                    >
                        <g>
                            <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
                        </g>
                    </svg>
                </button>

                {/* invisible */}
                <PopupMenu open={showUserMenu}>
                    <ul>
                        <LinkMenuItem to="/account">My account</LinkMenuItem>
                        <LinkMenuItem to="/notifications">Notifications</LinkMenuItem>
                        <li>
                            <hr className="border-t mx-2 border-gray-400" />
                        </li>
                        <LinkMenuItem to="/login" onClick={doLogout}>
                            Logout
                        </LinkMenuItem>
                    </ul>
                </PopupMenu>
            </div>

            <div className="block lg:hidden pr-4">
                <button
                    id="nav-toggle"
                    className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-100 hover:border-teal-500 appearance-none focus:outline-none"
                >
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>
        </>
    );
}

export default UserMenu;
