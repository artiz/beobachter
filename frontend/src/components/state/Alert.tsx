import React from "react";
import { ThailwindColor } from "ui/thailwind";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

interface AlertProps {
    title?: string;
    color?: ThailwindColor;
    text?: string;
    closable?: boolean;
}

function Alert({ title, text, closable = false, color = "orange" }: AlertProps) {
    const cls = `w-full text-white px-6 py-4 border-0 rounded relative mb-4 bg-${color}-500`;

    return (
        <div className={cls}>
            <span className="text-xl inline-block mr-5 align-middle">
                <Icon icon={["fas", "bell"]} />
            </span>
            <span className="inline-block align-middle mr-8">
                <b className="capitalize">{title}</b> {text}
            </span>
            {closable && (
                <button className="absolute bg-transparent text-2xl font-semibold leading-none cursor-pointer right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
                    <span>×</span>
                </button>
            )}
        </div>
    );
}

export default Alert;
