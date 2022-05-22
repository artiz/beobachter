import React from "react";
// import { ReactComponent as Logo } from "images/logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/Footer";
import Dashboard from "pages/Dashboard";
import Error from "pages/Error";
import Login from "pages/Login";

import "App.css";
function App() {
    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-grow">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        {/*  <Route  path="/sign-up" element={<SignUp />} /> */}
                        <Route path="*" element={<Error />} />
                    </Routes>
                </BrowserRouter>
            </div>

            <Footer />
        </div>
    );
}

export default App;
