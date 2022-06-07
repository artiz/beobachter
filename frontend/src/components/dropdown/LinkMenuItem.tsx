import React, { forwardRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface LinkMenuItemProps {
    to: string;
    children?: React.ReactNode;
    className?: string;
    onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkMenuItem = forwardRef<HTMLButtonElement, LinkMenuItemProps>(
    ({ to, className = "", onClick, children }, ref) => {
        const cls = `${className} no-underline`;
        const navigate = useNavigate();

        const handleClick = useCallback(
            (evt: React.MouseEvent<HTMLButtonElement>) => {
                navigate(to, { replace: true });
                onClick?.(evt);
            },
            [to, onClick, navigate]
        );

        return (
            <button onClick={handleClick} className={cls} ref={ref}>
                {children}
            </button>
        );
    }
);

LinkMenuItem.displayName = "LinkMenuItem";
export default LinkMenuItem;
