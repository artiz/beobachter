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

    return React.useMemo<JSX.Element>(() => (user ? cmp : <Login />) as JSX.Element, [user]);
}

export default AuthRoute;
