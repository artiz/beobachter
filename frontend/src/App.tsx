import React from "react";
// import { ReactComponent as Logo } from "images/logo.svg";
import Header from "components/header/Header";
import Footer from "components/Footer";
import Dashboard from "pages/Dashboard";

import "App.css";
function App() {
    return (
        <>
            <Header />
            <Dashboard />
            <Footer />
        </>
    );
}

export default App;
