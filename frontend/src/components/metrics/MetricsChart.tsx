import React, { useCallback, useEffect, useState } from "react";
import { ChartColors } from "ui/thailwind";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";

import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";

import * as moment from "moment";
import { NumDictionary } from "types/common";
type Domain = [number, number] | undefined;
interface IProps {
    title: string;
    field: string;
    lineColor?: string; // ChartColors[0]
    data: NumDictionary[];
    yRange?: Domain;
}

const formatDate = (ts: string | number): string => {
    if (Number.isFinite(ts)) {
        return moment.utc(+ts).format("YYYY-MM-DD HH:mm:ss");
    }
    return ts as string;
};

// Zoom logic copied from  https://codesandbox.io/s/recharts-scatter-plot-zoom-and-click-v68gk

export default function Cmp({ title, field, data = [], lineColor = ChartColors[0], yRange }: IProps) {
    const [isZooming, setIsZooming] = useState(false);
    const [zoomDomain, setZoomDomain] = useState<Domain>();
    const [xDomain, setXDomain] = useState<Domain>();
    const [filteredData, setFilteredData] = useState<NumDictionary[]>([]);

    useEffect(() => {
        if (!isZooming && !xDomain) {
            setFilteredData(data);
        }
    }, [data]);

    function handleZoomOut() {
        setXDomain(undefined);
        setZoomDomain(undefined);
        setFilteredData(data);
    }

    function handleMouseDown(e: CategoricalChartState) {
        const ts = +(e?.activeLabel || 0);
        if (ts) {
            setIsZooming(true);
            setZoomDomain([ts, ts]);
        }
    }

    function handleMouseMove(e: CategoricalChartState) {
        if (isZooming && e?.activeLabel !== undefined) {
            const ts = +e.activeLabel;
            const domain = zoomDomain ? [...zoomDomain] : [ts, ts];
            if (ts > domain[0]) {
                domain[1] = ts;
            } else {
                domain[0] = ts;
            }

            setZoomDomain(domain as Domain);
        }
    }

    function handleMouseUp() {
        if (isZooming) {
            if (zoomDomain) {
                setFilteredData(data?.filter((p) => p.ts >= zoomDomain[0] && p.ts <= zoomDomain[1]));
                setXDomain(zoomDomain);
            } else {
                setFilteredData(data);
                setXDomain(undefined);
            }

            setZoomDomain(undefined);
        }

        setIsZooming(false);
    }

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
                    data={filteredData}
                >
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis
                        dataKey="ts"
                        name="Date"
                        tickFormatter={formatDate}
                        allowDataOverflow={true}
                        interval="preserveStartEnd"
                    />
                    <YAxis domain={yRange} />
                    {<Tooltip labelFormatter={formatDate} />}

                    <ReferenceArea
                        isFront={true}
                        ifOverflow="visible"
                        fill="#cccccc"
                        x1={zoomDomain?.[0]}
                        x2={zoomDomain?.[1]}
                    />
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
