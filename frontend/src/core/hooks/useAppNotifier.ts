import { useState, useEffect, useCallback, useMemo } from "react";
import { Dictionary } from "types/common";
import { ThailwindColorStr } from "ui/thailwind";

export type NotificationType = "auth_error" | "api_error" | "error" | "warning" | "success" | "info";

class AppNotification {
    public isNotification = true;

    public type: NotificationType;
    public message?: string;

    constructor(type: NotificationType) {
        this.type = type;
    }

    [key: string]: string | number | boolean | undefined;
}

export function formatAuthError(data: Dictionary<string> | Error = {}): AppNotification {
    const notify = new AppNotification("auth_error");
    if (!(data instanceof Error)) {
        for (const key in data) {
            notify[key] = data[key];
        }
    }
    notify.message ||= "Authentication error, please log in again.";

    return notify;
}

export function formatError(message: string, data: Dictionary<string> = {}): AppNotification {
    const notify = new AppNotification("error");
    notify.message = message;

    for (const key in data) {
        notify[key] = data[key];
    }

    return notify;
}

export function sendNotification(notification: AppNotification) {
    window.postMessage(notification);
}

export function useAppNotifier(): [(notification: AppNotification) => void] {
    const notify = useCallback((notification: AppNotification) => {
        sendNotification(notification);
    }, []);

    return [notify];
}

export function useAppNotificationListener(): [
    notification: AppNotification | undefined,
    reset: () => void,
    text: string,
    color: ThailwindColorStr
] {
    const [notification, setNotification] = useState<AppNotification>();
    const closeAlert = useCallback(() => setNotification(undefined), [setNotification]);

    const handleMessage = (ev: MessageEvent) => {
        if (ev.data && ev.data.isNotification) {
            setNotification(ev.data);
        }
    };

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const alertColor = useMemo<ThailwindColorStr>(
        () => (notification?.type?.includes("error") ? "red" : notification?.type === "warning" ? "orange" : "emerald"),
        [notification]
    );

    const alertText = useMemo<string>(() => notification?.message || notification?.type || "Error", [notification]);

    useEffect(() => {
        const ts = setTimeout(closeAlert, 3000);
        return () => clearTimeout(ts);
    }, [closeAlert, notification]);

    return [notification, closeAlert, alertText, alertColor];
}
