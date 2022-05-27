import React from "react";
import { ThailwindColor } from "ui/thailwind";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

interface AlertProps {
    title?: string;
    color?: ThailwindColor;
    text: string;
    baseClass?: string;
    onClose?: () => void;
}

function Alert({ title, text, onClose, baseClass = "", color = "yellow" }: AlertProps) {
    const cls = `${baseClass} w-full text-white px-6 py-4 border rounded bg-${color}-500 border-${color}-600 transition delay-100`;

    return (
        <div className={cls}>
            <div className="relative">
                <span className="text-xl inline-block mr-5 align-middle">
                    <Icon icon={["fas", "bell"]} />
                </span>
                <span className="inline-block align-middle mr-8">
                    <b>{title}</b> {text}
                </span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute bg-transparent text-2xl font-semibold leading-none cursor-pointer right-0 top-0 outline-none focus:outline-none"
                    >
                        <span>×</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Alert;
