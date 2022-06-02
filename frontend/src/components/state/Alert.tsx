import React from "react";
import { ThailwindColorStr } from "ui/thailwind";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface AlertProps {
    title?: string;
    color?: ThailwindColorStr;
    baseClass?: string;
    onClose?: () => void;
    icon?: IconName;
    children: React.ReactNode;
}

function Alert({ title, children, onClose, baseClass = "mb-2 px-4 py-3", color = "yellow", icon }: AlertProps) {
    const cls = `${baseClass} w-full text-${color}-100 border rounded bg-${color}-500 border-${color}-600 transition delay-100`;

    return (
        <div className={cls}>
            <div className="relative">
                {icon && (
                    <span className="text-xl inline-block mr-5 align-middle">
                        <Icon icon={["fas", icon]} />
                    </span>
                )}
                <span className="inline-block align-middle mr-8">
                    {title && <b>{title}</b>} {children}
                </span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute bg-transparent text-2xl font-semibold leading-none cursor-pointer right-0 top-0 outline-none focus:outline"
                    >
                        <span>×</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Alert;
