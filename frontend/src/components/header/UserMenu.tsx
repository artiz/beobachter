import React, { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useAuthStatus } from "core/hooks/useAuthStatus";
import PopupMenu from "components/menu/PopupMenu";
import LinkMenuItem from "components/menu/LinkMenuItem";

function UserMenu() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, _, doLogout] = useAuthStatus();
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

    const handleMenuClick = useCallback(() => setShowUserMenu(!showUserMenu), [showUserMenu]);
    const userName = useMemo(() => user?.firstName || user?.email || "Profile", [user]);
    const avatar = useMemo<string | undefined>(() => user?.avatarUrl, [user]);

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="relative text-zinc-100">
                <button id="userButton" onClick={handleMenuClick} className="flex items-center focus:outline-none mr-3">
                    <img className="w-8 h-8 rounded-full mr-2 bg-zinc-200" src={avatar} alt="Avatar of User" />{" "}
                    <span className="hidden md:inline-block text-zinc-100 mr-2">{userName}</span>
                    <Icon icon={["fas", showUserMenu ? "angle-up" : "angle-down"]} />
                </button>

                <PopupMenu open={showUserMenu}>
                    <ul>
                        <LinkMenuItem to="/account">My account</LinkMenuItem>
                        <LinkMenuItem to="/notifications">Notifications</LinkMenuItem>
                        <li>
                            <hr className="border-t mx-2 border-zinc-400" />
                        </li>
                        <LinkMenuItem to="/login" onClick={doLogout}>
                            Logout
                        </LinkMenuItem>
                    </ul>
                </PopupMenu>
            </div>
        </>
    );
}

export default UserMenu;
