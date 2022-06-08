import React from "react";
import { useState, useEffect } from "react";
import { API_TOKEN, isTokenNotExpired } from "core/api/client";
import { User, JwtUser } from "core/models/user";
import jwtDecode from "jwt-decode";
import { useAppNotifier, formatError } from "./useAppNotifier";

const emptyUser = null as unknown as User;

export const AuthContext = React.createContext<User>(emptyUser);

export function useAuthStatus(): [User, boolean] {
    const [user, setUser] = useState<User>(emptyUser);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [notify] = useAppNotifier();

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
                    notify(formatError(e));
                }
                setUser(emptyUser);
            }
        } else {
            setUser(emptyUser);
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

    // auth entry point
    useEffect(() => {
        loadToken();
        window.addEventListener("storage", handleStorageUpdate);
        window.addEventListener("message", handleMessage);
        setInitialized(true);

        return () => {
            window.removeEventListener("storage", handleStorageUpdate);
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return [user, initialized];
}
