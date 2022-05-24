import React from "react";
import { Link } from "react-router-dom";

interface LinkMenuItemProps {
    to: string;
    wrap?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
}

function LinkMenuItem({ to, wrap = false, onClick, children }: LinkMenuItemProps) {
    const link = (
        <Link
            to={to}
            onClick={onClick}
            className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
        >
            {children}
        </Link>
    );

    return wrap ? <li>{link}</li> : link;
}

export default LinkMenuItem;
