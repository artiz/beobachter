import React from "react";
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

import "App.css";
// import LoadingCircle from "components/state/LoadingCircle";
function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, userLoading] = useAuthStatus();

    if (userLoading) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-200">
            <BrowserRouter>
                <Header />
                <div className="flex-grow container w-full mx-auto">
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
