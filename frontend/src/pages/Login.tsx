import React from "react";
import { APIClient } from "core/api/client";

const Login = () => {
    const client = new APIClient();
    client.login("admin@fastapi-react-project.com", "password");

    return (
        <div
            className="flex
            items-center
            justify-center
            "
        >
            <h1 className="font-bold text-blue-500 text-2xl">Login</h1>
        </div>
    );
};

export default Login;
