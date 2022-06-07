import { useState, useEffect } from "react";
import { useWebsocket } from "core/hooks/useWebsocket";

export interface IPerfMetrics {
    cpu_p?: number;
    vm_p?: number;
    ts: number;
}

export interface IMetricsMessage {
    type: "metrics" | "processes";
    data: IPerfMetrics;
}

export function usePerfMetricsState(): [IPerfMetrics | undefined, boolean] {
    const [metrics, setMetrics] = useState<IPerfMetrics>();
    const [message, loading] = useWebsocket<IMetricsMessage>("/system/ws_metrics");

    useEffect(() => {
        if (message?.type === "metrics") {
            setMetrics(message.data);
        }
    }, [message]);

    return [metrics, loading];
}
