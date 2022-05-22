import React, { FC, useMemo } from "react";
import { Route, PathRouteProps } from "react-router-dom";
import Login from "pages/Login";

const RouteRequiresLogin: FC<PathRouteProps> = (props: PathRouteProps) => {
    const userIsLogged = true; // useLoginStatus();
    const element = useMemo(() => (userIsLogged ? props.element : <Login />), [userIsLogged]);
    return <Route element={element} {...props} />;
};

export default RouteRequiresLogin;
