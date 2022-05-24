import React from "react";
import { Link } from "react-router-dom";
import LoadingCircle from "components/state/LoadingCircle";
import { ThailwindColor } from "ui/thailwind";

interface ButtonProps {
    title?: string;
    color?: ThailwindColor;
    loading?: boolean;
    groupCls?: string;
    isDefault?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    inline?: boolean;
    useRouter?: boolean;
    type?: "submit" | "reset" | "button";
    href?: string; // render as link
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLAnchorElement>;
}

function Button({
    loading = false,
    title,
    color = "emerald",
    disabled: disabled = false,
    isDefault = false,
    fullWidth = false,
    useRouter = false,
    inline = false,
    type = "button",
    children,
    href,
    onClick,
}: ButtonProps) {
    const theming = isDefault
        ? `bg-${color}-600 border-${color}-700 hover:border-${color}-600 hover:bg-${color}-500 active:bg-${color}-700 text-white`
        : `bg-transparent hover:bg-${color}-500 text-${color}-500 hover:text-white border border-${color}-500 hover:border-transparent active:bg-${color}-700`;

    const content = children ?? title;
    const buttonCls =
        "justify-center cursor-pointer font-sembold py-2 px-4 rounded transition ease-in-out delay-150 " +
        theming +
        (inline ? " m-2 " : " mb-4 mr-4 ") +
        (fullWidth ? " w-full " : " min-w-[6rem] ") +
        (disabled ? " opacity-50 cursor-not-allowed " : "");

    if (href) {
        return useRouter ? (
            <Link className={buttonCls} to={href} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>
                {content}
            </Link>
        ) : (
            <a className={buttonCls} href={href} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>
                {content}
            </a>
        );
    }

    return (
        <button
            className={buttonCls}
            disabled={disabled || loading}
            type={type}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        >
            {loading && <LoadingCircle color={isDefault ? "text-white" : `text-${color}-700`} />}
            {content}
        </button>
    );
}

export default Button;
