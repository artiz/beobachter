import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { ThailwindColor } from "ui/thailwind";

interface IProps {
    path: string;
    title: string;
    color?: ThailwindColor;
    icon?: IconName;
}

export default function Cmp({ path, title, color = "blue", icon = "home" }: IProps) {
    const location = useLocation();
    const selected = location.pathname?.startsWith(path);
    const linkCls =
        "block py-1 md:py-2 pl-1 align-middle no-underline hover:text-zinc-100 border-b-2 " +
        (selected ? ` text-${color}-400` : " text-zinc-400") +
        (selected ? ` border-${color}-400` : " border-zinc-900") +
        ` hover:border-${color}-400`;

    return (
        <li className="mr-6 my-2 md:my-0">
            <Link to={path} className={linkCls}>
                {icon && (
                    <i className="mr-3">
                        <Icon icon={["fas", icon]} />
                    </i>
                )}
                <span className="pb-1 md:pb-0 text-sm">{title}</span>
            </Link>
        </li>
    );
}
