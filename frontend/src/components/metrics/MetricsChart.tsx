import React from "react";
import { ChartColors } from "ui/thailwind";
import { IPerfMetrics } from "core/metrics/usePerfMetricsState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as moment from "moment";

interface IProps {
    title: string;
    field: string;
    lineColor?: string; // ChartColors[0]
    data: IPerfMetrics[];
    yRange?: [number, number];
}

const formatDate = (ts: string | number): string => {
    if (Number.isFinite(ts)) {
        return moment.utc(+ts * 1000).format("YYYY-MM-DD HH:mm:ss");
    }
    return ts as string;
};

// TODO: add Zoom: https://codesandbox.io/s/recharts-scatter-plot-zoom-and-click-v68gk

export default function Cmp({ title, field, data = [], lineColor = ChartColors[0], yRange }: IProps) {
    return (
        <ResponsiveContainer height="100%" width="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="ts" name="Date" tickFormatter={formatDate} interval="preserveStartEnd" />
                <YAxis domain={yRange} />
                <Tooltip labelFormatter={formatDate} />
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
    );
}
