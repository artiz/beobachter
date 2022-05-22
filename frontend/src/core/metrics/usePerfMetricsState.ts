import { useState, useEffect, useRef } from "react";
import config from "core/config";

export interface IPerfMetrics {
    cpu_perc: number;
    vm_perc: number;
    ts: number;
}

export function usePerfMetricsState(): [IPerfMetrics?, WebSocket?] {
    const [metrics, setMetrics] = useState<IPerfMetrics>();
    const websocket = useRef<WebSocket>();

    useEffect(() => {
        const basePath = config.wsBasePath;
        if (websocket.current && websocket.current.readyState !== WebSocket.CLOSED) {
            return;
        }

        const ws = new WebSocket(`${basePath}/ws_system_metrics`);
        websocket.current = ws;

        ws.onmessage = (event) => {
            // console.log("ws_system_metrics", event.data);
            setMetrics(JSON.parse(event.data));
        };

        // ws.onopen = () => {
        //     ws.send("init");
        // };

        return () => {
            // ws.close();
        };
    }, []);

    return [metrics, websocket.current];
}
