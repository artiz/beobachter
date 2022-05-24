import React, { FormEvent, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "components/button/Button";

import { APIClient } from "core/api/client";
import Input from "components/form/Input";
import Alert from "components/state/Alert";

const Login = () => {
    const client = new APIClient();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string>();

    // admin@fastapi-react-project.com
    const handleLogin = useCallback(() => {
        if (!username) {
            return;
        }
        setLoading(true);
        setError("");

        client
            .login(username, password || "")
            .catch((err) => setError(err.message || "Invalid credentials"))
            .then(() => navigate("/", { replace: true }))
            .finally(() => setLoading(false));
    }, [username, password]);

    const handleSubmit = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            handleLogin();
            ev.preventDefault();
            return false;
        },
        [handleLogin]
    );

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
            <div className="w-full md:w-2/3 lg:w-1/2 p-5 my-5 border-x border-gray-400">
                <div className="flex flex-col items-center">
                    <form onSubmit={handleSubmit} className="w-1/2">
                        <h1 className="font-bold text-emerald-700 text-2xl mb-5">Login</h1>

                        <Input label="Username (e-mail)" name="username" value={username} setter={setUsername}></Input>
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            setter={setPassword}
                        ></Input>

                        <Button type="submit" isDefault={true} loading={loading} disabled={!inputValid} inline={true}>
                            Login
                        </Button>
                    </form>

                    {error && <Alert title={error} text="Please check username/password" />}
                </div>
            </div>
        </div>
    );
};

export default Login;
