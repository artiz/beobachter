import { useState, useEffect, useCallback } from "react";
import { Dictionary } from "types/common";

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

export function useAppNotifier(): [(notification: AppNotification) => void] {
    const notify = useCallback((notification: AppNotification) => {
        window.postMessage(notification);
    }, []);

    return [notify];
}

export function useAppNotificationListener(): [
    notification: AppNotification | undefined,
    setter: (n: AppNotification | undefined) => void
] {
    const [notification, setNotification] = useState<AppNotification>();

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

    return [notification, setNotification];
}
