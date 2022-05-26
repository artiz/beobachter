import { useState, useEffect, useCallback } from "react";
import { API_TOKEN } from "core/api/client";
import { User, JwtUser } from "core/models/user";
import jwtDecode from "jwt-decode";

export function useAuthStatus(): [User | undefined, boolean, () => void] {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(true);

    const loadToken = () => {
        const token = localStorage.getItem(API_TOKEN);
        if (token) {
            try {
                const jwtUser = jwtDecode<JwtUser>(token);
                const user = User.fromJwt(jwtUser);
                setUser(user);

                // avatarUrl
            } catch (e) {
                // TODO: P1 - handle token error
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
