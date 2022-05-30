import React, { forwardRef } from "react";
import { MenuProps } from "./Menu";

interface ItemProps {
    label?: string;
    itemContent?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type Props = MenuProps & ItemProps;

export const MenuItem = forwardRef<HTMLButtonElement, Props>(
    ({ label, itemContent, disabled, className, onClick, ...props }, ref) => {
        return (
            <button
                {...props}
                ref={ref}
                role="menuitem"
                className={className + (disabled ? " opacity-75 cursor-not-allowed" : "")}
                disabled={disabled}
                onClick={onClick}
            >
                {itemContent}
                {label}
            </button>
        );
    }
);

MenuItem.displayName = "MenuItem";
export default MenuItem;
