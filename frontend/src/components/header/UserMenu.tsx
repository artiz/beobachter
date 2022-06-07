import React, { useMemo } from "react";
import { useAuthStatus } from "core/hooks/useAuthStatus";
import { Menu, LinkMenuItem, MenuSeparator } from "components/dropdown";

function UserMenu() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, _, doLogout] = useAuthStatus();
    const userName = useMemo(() => user?.firstName || user?.email || "Profile", [user]);
    const avatar = useMemo<string | undefined>(() => user?.avatarUrl, [user]);

    if (!user) {
        return null;
    }

    return (
        <>
            <Menu
                itemContent={
                    <div className="flex items-center focus:outline">
                        <img className="w-8 h-8 rounded-full mr-2 bg-zinc-200" src={avatar} alt="Avatar of User" />{" "}
                        <span className="hidden md:inline-block text-zinc-100">{userName}</span>
                    </div>
                }
                width="w-auto"
                inline={true}
            >
                <LinkMenuItem to="/account">My account</LinkMenuItem>
                <MenuSeparator />
                <LinkMenuItem to="/login" onClick={doLogout}>
                    Logout
                </LinkMenuItem>
            </Menu>
        </>
    );
}

export default UserMenu;
