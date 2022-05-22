import React from "react";
import LoadingCircle from "components/state/LoadingCircle";

interface ButtonProps {
    title?: string;
    loading?: boolean;
    groupCls?: string;
    isDefault?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    type?: "submit" | "reset" | "button";
    href?: string; // render as link
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLAnchorElement>;
}

function Button({
    loading = false,
    title,
    disabled: disabled = false,
    isDefault = false,
    fullWidth = false,
    type = "button",
    children,
    href,
    onClick,
}: ButtonProps) {
    const theming = isDefault
        ? "bg-teal-600 border-teal-700 hover:border-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white"
        : "bg-transparent hover:bg-teal-500 text-teal-500 hover:text-white border border-teal-500 hover:border-transparent active:bg-teal-700";

    const content = children ?? title;
    const buttonCls =
        "justify-center cursor-pointer font-sembold py-2 px-4 mb-4 mr-4 rounded " +
        theming +
        (fullWidth ? " w-full " : " min-w-[6rem] ") +
        (disabled ? " opacity-50 cursor-not-allowed " : "");

    return href ? (
        <a className={buttonCls} href={href} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>
            {content}
        </a>
    ) : (
        <button className={buttonCls} type={type} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}>
            {loading && <LoadingCircle color={isDefault ? "text-white" : "text-teal-700"} />}
            {content}
        </button>
    );
}

export default Button;
