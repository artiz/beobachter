import { useState, useEffect, useRef } from "react";
import config from "core/config";
import { API_TOKEN } from "core/api/client";

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

        const token = localStorage.getItem(API_TOKEN) ?? "";
        const ws = new WebSocket(`${config.wsBasePath}/ws_system_metrics?token=${encodeURIComponent(token)}`);
        websocket.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "metrics") {
                setMetrics(msg.data);
            }
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
