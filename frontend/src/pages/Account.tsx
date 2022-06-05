import React, { FormEvent, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "components/button/Button";

import { APIClient } from "core/api/client";
import Input from "components/form/Input";
import Alert from "components/state/Alert";
import { User } from "core/models/user";
import { Dictionary } from "types/common";

const Page = () => {
    const client = new APIClient();

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [validationErrors, setValidationErrors] = useState<Dictionary<string>>();

    const handleSubmit = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            user &&
                client
                    .updateProfile(user, { setLoading })
                    .then((res) => {
                        res && setUser(res);
                    })
                    .catch((err) => setError(err.message));

            ev.preventDefault();
            return false;
        },
        [user]
    );

    const updateUser = useCallback(
        (value: string, name?: string) => {
            if (name) {
                const updated = { ...user, [name]: value };
                setUser(updated as User);
            }
        },
        [user]
    );

    useEffect(() => {
        client
            .me({ setLoading })
            .then((res) => {
                setUser(res);
            })
            .catch((err) => setError(err.message || "Failed to load user data"));
    }, []);

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
                        <h1 className="font-bold text-emerald-700 text-2xl mb-5">Account</h1>

                        {user?.avatarUrl && (
                            <img src={user.avatarUrl} className="w-32 h-32 mb-5 rounded border border-zinc-400" />
                        )}
                        <Input
                            label="Username (e-mail)"
                            readOnly={true}
                            required={true}
                            name="email"
                            value={user?.email}
                        ></Input>
                        <Input
                            label="First Name"
                            name="firstName"
                            required={true}
                            value={user?.firstName}
                            setter={updateUser}
                        ></Input>
                        <Input label="Last Name" name="lastName" value={user?.lastName} setter={updateUser}></Input>

                        <Button type="submit" disabled={!user || !!validationErrors}>
                            Update
                        </Button>
                        <Button type="reset" outline={true} disabled={loading}>
                            Reset
                        </Button>
                    </form>

                    {error && (
                        <Alert baseClass="mt-4 px-4 py-3" color="orange" title="Error">
                            {error}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
