import React, { FormEvent, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "components/button/Button";

import { APIClient } from "core/api/client";
import Input from "components/form/Input";
import Alert from "components/state/Alert";

const Login = () => {
    const client = new APIClient();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    // admin@fastapi-react-project.com
    const handleLogin = useCallback(() => {
        if (!username) {
            return;
        }
        setLoading(true);
        setError("");

        client
            .login(username, password || "")
            .then(() => {
                if (location.pathname === "/login") {
                    navigate("/", { replace: true });
                }
            })
            .catch((err) => setError(err.message || "Invalid credentials"))
            .finally(() => setLoading(false));
    }, [username, password, navigate, location]);

    const handleSubmit = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            handleLogin();
            ev.preventDefault();
            return false;
        },
        [handleLogin]
    );

    useEffect(() => {
        const tm = setTimeout(() => {
            const username = usernameRef?.current;
            const password = passwordRef?.current;

            if (username && password) {
                // username.focus();
                const evt = new Event("focus");
                username.dispatchEvent(evt);
            }
        }, 200);

        return () => clearTimeout(tm);
    }, [usernameRef]);

    const inputValid = useMemo(
        () => !!username?.toString()?.trim() && !!password?.toString()?.trim(),
        [username, password]
    );

    return (
        <div
            className="flex
            items-center
            justify-center
            "
        >
            <div className="w-full md:w-2/3 lg:w-1/2 p-5 my-5 border-x border-zinc-400">
                <div className="flex flex-col items-center">
                    <form onSubmit={handleSubmit} className="w-1/2">
                        <h1 className="font-bold text-emerald-700 text-2xl mb-5">Login</h1>

                        <Input
                            ref={usernameRef}
                            label="Username (e-mail)"
                            name="username"
                            value={username}
                            setter={setUsername}
                        ></Input>
                        <Input
                            ref={passwordRef}
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            setter={setPassword}
                        ></Input>

                        <Button type="submit" loading={loading} disabled={!inputValid} inline={false}>
                            Login
                        </Button>
                    </form>

                    {error && (
                        <Alert baseClass="mt-4 p-4" color="orange" title="Error">
                            Please check username/password
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
