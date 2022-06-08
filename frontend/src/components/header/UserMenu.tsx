import React, { useMemo } from "react";
import { Menu, LinkMenuItem, MenuSeparator } from "components/dropdown";
import { doLogout } from "core/api/client";
import { User } from "core/models/user";

interface IProps {
    user: User;
}
function UserMenu({ user }: IProps) {
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
