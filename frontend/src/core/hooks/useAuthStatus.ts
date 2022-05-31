import { useState, useEffect, useCallback } from "react";
import { API_TOKEN, isTokenNotExpired } from "core/api/client";
import { User, JwtUser } from "core/models/user";
import jwtDecode from "jwt-decode";
import { useAppNotifier, useAppNotificationListener, formatError } from "./useAppNotifier";

export function useAuthStatus(): [User | undefined, boolean, () => void] {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(true);
    const [notify] = useAppNotifier();
    const [notification] = useAppNotificationListener();

    const loadToken = () => {
        const token = localStorage.getItem(API_TOKEN);
        if (token) {
            try {
                const jwtUser = jwtDecode<JwtUser>(token);
                if (isTokenNotExpired(jwtUser)) {
                    const user = User.fromJwt(jwtUser);
                    setUser(user);
                }
            } catch (e) {
                if (e instanceof Error) {
                    notify(
                        formatError(e.toString(), {
                            name: e.name,
                            stack: e.stack,
                        })
                    );
                }
                setUser(undefined);
            }
        } else {
            setUser(undefined);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStorageUpdate = (ev: StorageEvent): any => {
        if (ev.key === API_TOKEN) {
            loadToken();
        }
    };
    const handleMessage = (ev: MessageEvent) => {
        if (ev.data === API_TOKEN) {
            loadToken();
        }
    };

    const doLogout = useCallback(() => {
        localStorage.removeItem(API_TOKEN);
        setUser(undefined);
        window.postMessage(API_TOKEN);
    }, []);

    useEffect(() => {
        if (notification?.type === "auth_error") {
            doLogout();
        }
    }, [notification, doLogout]);

    useEffect(() => {
        loadToken();
        window.addEventListener("storage", handleStorageUpdate);
        window.addEventListener("message", handleMessage);
        setLoading(false);

        return () => {
            window.removeEventListener("storage", handleStorageUpdate);
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return [user, loading, doLogout];
}
