import { useState, useEffect, useRef } from "react";
import config from "core/config";
import { API_TOKEN } from "core/api/client";

export interface IPerfMetrics {
    cpu_perc: number;
    vm_perc: number;
    ts: number;
}

export function usePerfMetricsState(): [IPerfMetrics | undefined, boolean] {
    const [metrics, setMetrics] = useState<IPerfMetrics>();
    const [loading, setLoading] = useState<boolean>(false);

    const websocket = useRef<WebSocket>();

    useEffect(() => {
        if (websocket.current && websocket.current.readyState !== WebSocket.CLOSED) {
            return;
        }

        setLoading(true);

        const token = localStorage.getItem(API_TOKEN) ?? "";
        const ws = new WebSocket(`${config.wsBasePath}/ws_system_metrics?token=${encodeURIComponent(token)}`);
        websocket.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "metrics") {
                setMetrics(msg.data);
            } else if (msg.type === "auth_error") {
                // TODO: window.postMessage(AUTH_ERROR)
            }
        };

        ws.onclose = () => {
            setLoading(false);
        };

        ws.onopen = () => {
            setLoading(false);
            //ws.send("init");
        };

        return () => {
            // ws.close();
        };
    }, []);

    return [metrics, loading];
}
