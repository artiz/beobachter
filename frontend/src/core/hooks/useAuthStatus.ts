import { useState, useEffect, useCallback } from "react";
import { API_TOKEN_KEY } from "core/api/client";
import { User, JwtUser } from "core/models/user";
import jwtDecode from "jwt-decode";

export function useAuthStatus(): [User | undefined, boolean, () => void] {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(true);

    const loadToken = () => {
        const token = localStorage.getItem(API_TOKEN_KEY);
        if (token) {
            try {
                const jwtUser = jwtDecode<JwtUser>(token);
                setUser(User.fromJwt(jwtUser));
            } catch (e) {
                // TODO:
                // const notifier = useAppNotifier();
                // notifier.error(e);
                setUser(undefined);
            }
        } else {
            setUser(undefined);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStorageUpdate = (ev: StorageEvent): any => {
        if (ev.key === API_TOKEN_KEY) {
            loadToken();
        }
    };
    const handleMessage = (ev: MessageEvent) => {
        if (ev.data === API_TOKEN_KEY) {
            loadToken();
        }
    };

    const doLogout = useCallback(() => {
        localStorage.removeItem(API_TOKEN_KEY);
        setUser(undefined);
        window.postMessage(API_TOKEN_KEY);
    }, []);

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
