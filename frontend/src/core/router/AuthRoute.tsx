import React from "react";
import Login from "pages/Login";
import { useAuthStatus } from "core/hooks/useAuthStatus";

interface AuthRouteProps {
    cmp: React.ReactElement | null;
}

function AuthRoute(props: AuthRouteProps) {
    const [user] = useAuthStatus();
    // TODO: fix it
    // const element = React.useMemo<JSX.Element>(() => (user ? props.cmp : <Login />), [user]);
    // return element;

    return user ? props.cmp : <Login />;
}

export default AuthRoute;
