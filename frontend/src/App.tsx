import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/Footer";
import { Home, Monitoring, Error, Login, SignUp, Account } from "pages";
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
        <>
            {notification && (
                <Alert
                    title="Notification"
                    baseClass="fixed z-50 mt-1 px-4 py-3 mx-auto left-0 right-0 w-full max-w-xl"
                    onClose={closeAlert}
                    icon="bell"
                    color={alertColor}
                >
                    {alertText}
                </Alert>
            )}
            <div className="h-screen flex flex-col bg-zinc-200">
                <BrowserRouter>
                    <Header />
                    <div className="flex-grow container w-full mx-auto mb-10">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route
                                path="/monitoring"
                                element={<AuthRoute loading={userLoading} cmp={<Monitoring />} />}
                            />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/account" element={<AuthRoute loading={userLoading} cmp={<Account />} />} />

                            <Route path="*" element={<Error />} />
                        </Routes>
                    </div>

                    <Footer />
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;
