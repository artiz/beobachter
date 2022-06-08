import React from "react";
import Login from "pages/Login";
import { AuthContext } from "core/hooks/useAuthStatus";

interface AuthRouteProps {
    cmp: React.ReactElement | null;
}

function AuthRoute(props: AuthRouteProps) {
    const { cmp } = props;
    return <AuthContext.Consumer>{(user) => (user ? cmp : <Login />)}</AuthContext.Consumer>;
}

export default AuthRoute;
