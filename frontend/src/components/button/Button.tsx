import React from "react";
import { Link } from "react-router-dom";
import LoadingCircle from "components/state/LoadingCircle";
import { ThailwindColorStr } from "ui/thailwind";

interface ButtonProps {
    title?: string;
    color?: ThailwindColorStr;
    loading?: boolean;
    groupCls?: string;
    outline?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    inline?: boolean;
    useRouter?: boolean;
    type?: "submit" | "reset" | "button";
    href?: string; // render as link
    className?: string;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLAnchorElement>;
}

function Button({
    loading = false,
    title,
    color = "emerald",
    disabled = false,
    outline = false,
    inline = true,
    fullWidth = false,
    useRouter = false,
    type = "button",
    className = "",
    children,
    href,
    onClick,
}: ButtonProps) {
    const theming = outline
        ? `bg-transparent  text-${color}-500 border border-${color}-500 `
        : `border bg-${color}-600 border-${color}-700  text-${color}-100`;

    const content = children ?? title;
    const buttonCls =
        className +
        " justify-center cursor-pointer text-sm m-0 py-2 px-4 rounded transition ease-in-out delay-10 " +
        theming +
        (inline ? " m-0 mr-2 " : " mb-2 mr-2 ") +
        (fullWidth ? " w-full " : " min-w-[6rem] ") +
        (disabled
            ? " opacity-50 cursor-not-allowed "
            : outline
            ? ` hover:bg-${color}-500 hover:text-${color}-100 hover:border-transparent active:bg-${color}-700 `
            : ` hover:border-${color}-600 hover:bg-${color}-500 active:bg-${color}-700 `);

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
            {loading && <LoadingCircle color={outline ? `text-${color}-700` : `text-${color}-100`} />}
            {content}
        </button>
    );
}

export default Button;
