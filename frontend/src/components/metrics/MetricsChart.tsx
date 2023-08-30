import React, { useCallback, useLayoutEffect, useState } from "react";
import { ChartColors } from "ui/thailwind";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";

import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";

import moment from "moment";
import { NumDictionary } from "types/common";

type Domain = [number | string, number | string];
type NumberDomain = [number, number];

interface IProps {
    title: string;
    field: string;
    lineColor?: string; // ChartColors[0]
    data: NumDictionary[];
    yRange?: Domain;
}

const formatDate = (ts: string | number): string => {
    if (Number.isFinite(ts)) {
        return moment(+ts).format("YYYY-MM-DD HH:mm:ss");
    }
    return ts as string;
};

// Zoom logic copied from  https://codesandbox.io/s/recharts-scatter-plot-zoom-and-click-v68gk

export default function Cmp({
    title,
    field,
    data = [],
    lineColor = ChartColors[0],
    yRange = [0, "dataMax+5"],
}: IProps) {
    const [isZooming, setIsZooming] = useState(false);
    const [updateXDomain, setUpdateXDomain] = useState(false);
    const [zoomDomain, setZoomDomain] = useState<NumberDomain | undefined>();
    const [xDomain, setXDomain] = useState<NumberDomain | undefined>();
    const [displayData, setDisplayData] = useState<NumDictionary[]>([]);

    const loadDisplayData = useCallback(
        (points: NumDictionary[]) => {
            if (!points) {
                setDisplayData([]);
                return;
            }

            let domain: NumberDomain | undefined = xDomain;
            if (updateXDomain && xDomain) {
                domain = [xDomain[0], points?.at(-1)?.["ts"] ?? xDomain[1]];
            }

            if (domain) {
                const [begin, end] = domain;
                setDisplayData(points.filter((p) => p.ts >= begin && p.ts <= end));
            } else {
                setDisplayData(points);
            }
        },
        [setDisplayData, xDomain, updateXDomain]
    );

    useLayoutEffect(() => {
        if (!isZooming) {
            loadDisplayData(data);
        }
    }, [data, isZooming, loadDisplayData]);

    const handleZoomOut = useCallback(() => {
        setXDomain(undefined);
        setDisplayData(data);
    }, [data]);

    const handleMouseDown = useCallback((e: CategoricalChartState) => {
        const ts = +(e?.activeLabel || 0);
        if (ts) {
            setIsZooming(true);
            setZoomDomain([ts, ts]);
        }
    }, []);

    const handleMouseMove = useCallback(
        (e: CategoricalChartState) => {
            if (isZooming && e?.activeLabel !== undefined) {
                const ts = +e.activeLabel;
                const domain: NumberDomain = zoomDomain ? [...zoomDomain] : [ts, ts];
                if (ts > domain[0]) {
                    domain[1] = ts;
                } else {
                    domain[0] = ts;
                }

                setZoomDomain(domain);
            }
        },
        [isZooming, zoomDomain]
    );

    const handleMouseUp = useCallback(() => {
        if (isZooming) {
            if (zoomDomain && zoomDomain[1] >= (displayData?.at(-1)?.["ts"] ?? 0 + 30000)) {
                setUpdateXDomain(true);
            } else {
                setUpdateXDomain(false);
            }

            setXDomain(zoomDomain);
            setZoomDomain(undefined);
        }

        setIsZooming(false);
    }, [isZooming, zoomDomain, displayData]);

    return (
        <div className="relative h-full w-full select-none">
            {xDomain && (
                <button
                    onClick={handleZoomOut}
                    className="absolute m-auto left-0 right-0 w-20 top-2 z-10 text-zinc-800 border border-zinc-400 bg-zinc-500 hover:bg-zinc-400 p-1 rounded"
                >
                    Zoom Out
                </button>
            )}

            <ResponsiveContainer height="100%" width="100%">
                <LineChart
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5,
                    }}
                    width={500}
                    height={300}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    data={displayData}
                >
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis
                        dataKey="ts"
                        type="number"
                        name="Date"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                        scale="time"
                    />
                    <YAxis domain={yRange} />
                    <Tooltip labelFormatter={formatDate} />

                    {zoomDomain && (
                        <ReferenceArea
                            isFront={true}
                            ifOverflow="visible"
                            fill="#cccccc"
                            x1={zoomDomain?.[0]}
                            x2={zoomDomain?.[1]}
                        />
                    )}
                    <Line
                        type="monotone"
                        name={title}
                        dataKey={field}
                        dot={false}
                        stroke={lineColor}
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
