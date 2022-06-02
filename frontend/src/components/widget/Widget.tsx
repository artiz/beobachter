import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { Padding, ThailwindColorStr } from "ui/thailwind";

interface IProps {
    title?: string;
    icon?: IconName;
    color?: ThailwindColorStr;
    iconColor?: ThailwindColorStr;
    children?: React.ReactNode;
    size?: "1" | "1/2" | "1/4" | "3/4";
    padding?: Padding;
    bodyPadding?: Padding;
    bodyPaddingY?: Padding;
}

export default function Cmp({
    title,
    color = "zinc",
    icon,
    iconColor,
    size = "1",
    padding = "2",
    bodyPadding = "4",
    bodyPaddingY = "2",
    children,
}: IProps) {
    if (!iconColor) {
        iconColor = color;
    }

    const rootCls = `w-full md:w-${size} p-${padding}`;
    const bodyCls = `relative p-${bodyPadding} leading-relaxed `;
    const contentCls = `bg-${color}-900 border border-${color}-800 rounded shadow-lg text-${color}-500`;
    const headerCls = `flex flex-row border-b border-${color}-800 px-${bodyPadding} py-${bodyPaddingY}`;
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
