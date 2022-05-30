import React from "react";
import { Link } from "react-router-dom";
import { ThailwindColorStr } from "ui/thailwind";

interface Props {
    href: string;
    target?: string;
    color?: ThailwindColorStr;
    children?: React.ReactNode;
}

function WidgetLink({ target, href = "/", color = "zinc", children }: Props) {
    const cls = ` text-${color}-400 underline active:text-${color}-100 hover:text-${color}-100 hover:underline `;

    return href.match(/^(http|ftp)/) ? (
        <a className={cls} href={href} target={target}>
            {children}
        </a>
    ) : (
        <Link className={cls} to={href}>
            {children}
        </Link>
    );
}

export default WidgetLink;
