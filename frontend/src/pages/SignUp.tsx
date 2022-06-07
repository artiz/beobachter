import React, { FormEvent, useCallback, useMemo, useState } from "react";
// import { APIClient } from "core/api/client";
import Button from "components/button/Button";
import Alert from "components/state/Alert";
import Input from "components/form/Input";
import { APIClient } from "core/api/client";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const client = new APIClient();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    const handleSubmit = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            setError("");
            if (!email) {
                return;
            }

            setLoading(true);

            client
                .register({ email, password, first_name: firstName, last_name: lastName })
                .then(() => {
                    navigate("/", { replace: true });
                })
                .catch((err) => setError(err.message || "Failed to register"))
                .finally(() => setLoading(false));

            return false;
        },
        [email, password, firstName, lastName, navigate]
    );

    const inputValid = useMemo(() => !!email?.toString()?.trim() && !!password?.toString()?.trim(), [email, password]);

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
                        <h1 className="font-bold text-emerald-700 text-2xl mb-5">SignUp</h1>

                        <Input
                            label="E-mail"
                            name="email"
                            type="email"
                            required={true}
                            value={email}
                            setter={setEmail}
                        ></Input>
                        <Input label="First Name" name="firstName" value={firstName} setter={setFirstName}></Input>
                        <Input label="Last Name" name="lastName" value={lastName} setter={setLastName}></Input>

                        <Input
                            label="Password"
                            name="password"
                            required={true}
                            type="password"
                            value={password}
                            setter={setPassword}
                        ></Input>

                        <Button type="submit" disabled={loading || !inputValid}>
                            Register
                        </Button>
                    </form>

                    {error && (
                        <Alert baseClass="mt-4 p-4" color="orange" title="Error">
                            {error}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
