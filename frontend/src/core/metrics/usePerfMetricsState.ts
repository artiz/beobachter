import { useState, useEffect, useRef, useCallback } from "react";
import config from "core/config";
import { API_TOKEN } from "core/api/client";
import { sendNotification, formatAuthError } from "core/hooks/useAppNotifier";

export interface IPerfMetrics {
    cpu_p?: number;
    vm_p?: number;
    ts: number;
}

export function usePerfMetricsState(): [IPerfMetrics | undefined, boolean] {
    const [metrics, setMetrics] = useState<IPerfMetrics>();
    const [loading, setLoading] = useState<boolean>(false);
    const websocket = useRef<WebSocket>();

    const connectSocket = useCallback(() => {
        if (websocket.current && [WebSocket.CONNECTING, WebSocket.OPEN].includes(websocket.current.readyState)) {
            websocket.current.close(1000);
            return;
        }

        const timeout = setTimeout(() => setLoading(true), 100);

        const token = localStorage.getItem(API_TOKEN) ?? "";
        const ws = new WebSocket(`${config.wsBasePath}/ws_system_metrics?token=${encodeURIComponent(token)}`);
        websocket.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "metrics") {
                setMetrics(msg.data);
            }
        };

        ws.onclose = (evt: CloseEvent) => {
            if (evt.code > 1000) {
                sendNotification(formatAuthError());
            }
            if (websocket.current) {
                setLoading(false);
            }
        };

        ws.onopen = () => {
            clearTimeout(timeout);
            if (websocket.current) {
                setLoading(false);
            }
        };
    }, [setLoading]);

    useEffect(() => {
        const timeout = setTimeout(connectSocket, 250);

        return () => {
            clearTimeout(timeout);
            const ws = websocket.current;
            websocket.current = undefined;
            if (ws) {
                ws.close(1000);
            }
        };
    }, [websocket]);

    return [metrics, loading];
}
