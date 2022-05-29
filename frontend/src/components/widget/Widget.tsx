import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { ThailwindColor } from "ui/thailwind";

interface IProps {
    title?: string;
    color?: ThailwindColor;
    icon?: IconName;
    iconColor?: ThailwindColor;
    children?: React.ReactNode;
    size?: "1" | "1/2" | "1/4";
    padding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
    bodyPadding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
}

export default function Cmp({
    title,
    color = "zinc",
    icon,
    iconColor,
    size = "1",
    padding = "3",
    bodyPadding = "3",
    children,
}: IProps) {
    if (!iconColor) {
        iconColor = color;
    }

    const rootCls = `w-full md:w-${size} p-${padding}`;
    const bodyCls = `relative p-${bodyPadding}`;
    const contentCls = `bg-${color}-900 border border-${color}-800 rounded shadow text-${color}-500`;
    const headerCls = `flex flex-row border-b border-${color}-800 p-${bodyPadding}`;
    const titleCls = `font-bold uppercase`;
    const iconCls = `text-${iconColor}-600 mr-2`;

    return (
        <div className={rootCls}>
            <div className={contentCls}>
                {title && (
                    <div className={headerCls}>
                        <div className="flex flex-shrink">
                            {icon && (
                                <div className={iconCls}>
                                    <Icon icon={["fas", icon]} size="lg" />
                                </div>
                            )}
                        </div>
                        <h5 className={titleCls}>{title}</h5>
                    </div>
                )}

                <div className={bodyCls}>{children}</div>
            </div>
        </div>
    );
}
