import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/Footer";
import Home from "pages/Home";
import Monitoring from "pages/Monitoring";
import Error from "pages/Error";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import AuthRoute from "core/router/AuthRoute";
import { useAuthStatus } from "core/hooks/useAuthStatus";
import { useAppNotificationListener } from "core/hooks/useAppNotifier";
import Alert from "components/state/Alert";

import "App.css";

function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, userLoading] = useAuthStatus();
    const [notification, closeAlert, alertText, alertColor] = useAppNotificationListener();

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
                    icon="bell"
                    color={alertColor}
                >
                    {alertText}
                </Alert>
            )}

            <BrowserRouter>
                <Header />
                <div className="flex-grow container w-full mx-auto mb-10">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/monitoring" element={<AuthRoute loading={userLoading} cmp={<Monitoring />} />} />
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
