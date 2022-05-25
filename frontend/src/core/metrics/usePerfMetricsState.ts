import { useState, useEffect, useRef } from "react";
import config from "core/config";
import { API_TOKEN_KEY } from "core/api/client";

export interface IPerfMetrics {
    cpu_perc: number;
    vm_perc: number;
    ts: number;
}

export function usePerfMetricsState(): [IPerfMetrics?, WebSocket?] {
    const [metrics, setMetrics] = useState<IPerfMetrics>();
    const websocket = useRef<WebSocket>();

    useEffect(() => {
        if (websocket.current && websocket.current.readyState !== WebSocket.CLOSED) {
            return;
        }

        const token = localStorage.getItem(API_TOKEN_KEY) ?? "";
        const ws = new WebSocket(`${config.wsBasePath}/ws_system_metrics?token=${encodeURIComponent(token)}`);
        websocket.current = ws;

        ws.onmessage = (event) => {
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
