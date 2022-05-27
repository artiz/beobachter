import React, { useCallback, useEffect, useMemo } from "react";
// import { ReactComponent as Logo } from "images/logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/Footer";
import Dashboard from "pages/Dashboard";
import Error from "pages/Error";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import AuthRoute from "core/router/AuthRoute";
import { useAuthStatus } from "core/hooks/useAuthStatus";
import { useAppNotificationListener } from "core/hooks/useAppNotifier";
import "App.css";
import Alert from "components/state/Alert";
import { ThailwindColor } from "ui/thailwind";
// import LoadingCircle from "components/state/LoadingCircle";
function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, userLoading] = useAuthStatus();
    const [notification, setNotification] = useAppNotificationListener();

    const closeAlert = useCallback(() => setNotification(undefined), [setNotification]);
    const alertColor = useMemo<ThailwindColor>(
        () => (notification?.type?.includes("error") ? "red" : notification?.type === "warning" ? "orange" : "emerald"),
        [notification]
    );
    const alertText = useMemo<string>(() => notification?.message || notification?.type || "Error", [notification]);
    useEffect(() => {
        void setTimeout(closeAlert, 2500);
    }, [closeAlert, notification]);
    if (userLoading) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col bg-zinc-200">
            {notification && (
                <Alert
                    title="Notification"
                    baseClass="absolute z-50 mt-1 mx-auto left-0 right-0 w-full max-w-xl"
                    onClose={closeAlert}
                    color={alertColor}
                    text={alertText}
                />
            )}

            <BrowserRouter>
                <Header />
                <div className="flex-grow container w-full mx-auto mb-10">
                    <Routes>
                        <Route path="/" element={<AuthRoute loading={userLoading} cmp={<Dashboard />} />} />
                        <Route path="/dashboard" element={<AuthRoute loading={userLoading} cmp={<Dashboard />} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>

                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
