import React, { FormEvent, useCallback } from "react";
import { APIClient } from "core/api/client";
import Button from "components/button/Button";

const SignUp = () => {
    const handleSubmit = useCallback((ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        return false;
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
                        <h1 className="font-bold text-emerald-700 text-2xl mb-5">SignUp</h1>

                        <Button type="submit" isDefault={true} inline={true}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>{" "}
        </div>
    );
};

export default SignUp;
