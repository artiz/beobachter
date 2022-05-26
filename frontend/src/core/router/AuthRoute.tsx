import React from "react";
import Login from "pages/Login";
import { useAuthStatus } from "core/hooks/useAuthStatus";

interface AuthRouteProps {
    cmp: React.ReactElement | null;
    loading?: boolean;
}

function AuthRoute(props: AuthRouteProps) {
    const [user] = useAuthStatus();
    const { cmp, loading } = props;

    if (loading) {
        return null;
    }

    // TODO: fix it
    // const element = React.useMemo<JSX.Element>(() => (user ? props.cmp : <Login />), [user]);
    // return element;

    return user ? cmp : <Login />;
}

export default AuthRoute;
