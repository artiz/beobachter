import { useState, useEffect, useCallback, useRef } from "react";
import { API_TOKEN, AuthenticationError } from "core/api/client";
import config from "core/config";
import { sendNotification, formatError } from "core/hooks/useAppNotifier";

export function useWebsocket<T>(endpoint: string, authenticate = true): [message: T | undefined, loading: boolean] {
    const [message, setMessage] = useState<T>();
    const [loading, setLoading] = useState<boolean>(false);

    const websocket = useRef<WebSocket>();

    const connectSocket = useCallback(() => {
        if (websocket.current && [WebSocket.CONNECTING, WebSocket.OPEN].includes(websocket.current.readyState)) {
            websocket.current.close(1000);
            return;
        }

        const timeout = setTimeout(() => setLoading(true), 100);

        const token = localStorage.getItem(API_TOKEN) ?? "";
        const url = `${config.wsBasePath}${endpoint}${authenticate ? "?token=" + encodeURIComponent(token) : ""}`;
        const ws = new WebSocket(url);
        websocket.current = ws;

        ws.onmessage = (event) => {
            // eslint-disable-next-line no-console
            if (event.type === "message") {
                const data = JSON.parse(event.data);
                setMessage(data);
            }
        };

        ws.onclose = (evt: CloseEvent) => {
            if (evt.code > 1000) {
                sendNotification(formatError(new AuthenticationError(evt.code)));
            }
            setLoading(false);
            clearTimeout(timeout);
        };

        ws.onopen = () => {
            clearTimeout(timeout);
            if (websocket.current) {
                setLoading(false);
            }
        };
    }, [setLoading]);

    useEffect(() => {
        const tm = setTimeout(connectSocket, 250);

        return () => {
            clearTimeout(tm);
            const ws = websocket.current;
            websocket.current = undefined;
            if (ws) {
                ws.close(1000);
            }
        };
    }, [websocket]);

    return [message, loading];
}
