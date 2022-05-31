import React, { forwardRef } from "react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "./Menu";

interface ItemProps {
    label?: string;
    itemContent?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    icon?: IconName;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type Props = MenuProps & ItemProps;

export const MenuItem = forwardRef<HTMLButtonElement, Props>(
    ({ label, itemContent, disabled, className, onClick, icon, ...props }, ref) => {
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
                {icon && (
                    <i className="ml-1">
                        <Icon icon={["fas", icon]} />
                    </i>
                )}
            </button>
        );
    }
);

MenuItem.displayName = "MenuItem";
export default MenuItem;
