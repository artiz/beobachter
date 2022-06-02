import React, { ReactNode, useEffect, useLayoutEffect } from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { ThailwindColorStr } from "ui/thailwind";
import LoadingCircle from "components/state/LoadingCircle";

interface IProps {
    title: string;
    color?: ThailwindColorStr;
    icon?: IconName;
    iconColor?: ThailwindColorStr;
    padding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

    value?: string | number | undefined;
    loading?: boolean;
}

export default function Cmp({ title, color = "zinc", icon, iconColor, padding = "3", value, loading = false }: IProps) {
    if (!iconColor) {
        iconColor = color;
    }

    const iconBlockCls = `flex-shrink pr-${padding}`;
    const iconCls = `rounded p-${padding} bg-${iconColor}-600 mr-${padding}`;
    const titleCls = `font-bold uppercase text-${color}-400`;
    const metricsCls = `font-bold text-2xl text-${color}-600`;

    // const [prevValue, setPrevValue] = React.useState<string | number | undefined>();
    // useLayoutEffect(() => {
    //     setPrevValue(value);
    // }, [value]);

    // let direction: ReactNode = <Icon icon={["fas", "exchange"]} className={`text-${iconColor}-500`} />;

    // if (prevValue != undefined && value != undefined) {
    //     if (prevValue > value) {
    //         direction = <Icon icon={["fas", "caret-down"]} className={`text-${iconColor}-500`} />;
    //     } else if (prevValue < value) {
    //         direction = <Icon icon={["fas", "caret-up"]} className={`text-${iconColor}-500`} />;
    //     }
    // }

    return (
        <div className="flex flex-row items-center">
            {icon && (
                <div className={iconBlockCls}>
                    <div className={iconCls}>
                        <Icon icon={["fas", icon]} inverse={true} size="2x" />
                    </div>
                </div>
            )}

            <div className="flex-1 text-right md:text-center">
                <h5 className={titleCls}>{title}</h5>
                <h3 className={metricsCls}>
                    {loading ? (
                        <div className="flex items-center">
                            <LoadingCircle height="h-6" width="w-full" />
                        </div>
                    ) : (
                        value ?? <i>...</i>
                    )}
                </h3>
            </div>
        </div>
    );
}
