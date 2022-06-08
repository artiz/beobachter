import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/Footer";
import { Home, Monitoring, Error, Login, SignUp, Account } from "pages";
import AuthRoute from "core/router/AuthRoute";
import { AuthContext, useAuthStatus } from "core/hooks/useAuthStatus";
import { useAppNotificationListener } from "core/hooks/useAppNotifier";
import Alert from "components/state/Alert";

import "App.css";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/monitoring" element={<AuthRoute cmp={<Monitoring />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<AuthRoute cmp={<Account />} />} />
        <Route path="*" element={<Error />} />
    </Routes>
);

function App() {
    const [user, userLoaded] = useAuthStatus();
    const [notification, closeAlert, alertText, alertColor, alertTitle] = useAppNotificationListener();

    if (!userLoaded) {
        return null;
    }

    return (
        <AuthContext.Provider value={user}>
            {notification && (
                <Alert
                    title={alertTitle}
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
                    <Header user={user} />
                    <div className="flex-grow container w-full mx-auto mb-10">
                        <AppRoutes />
                    </div>
                    <Footer />
                </BrowserRouter>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
