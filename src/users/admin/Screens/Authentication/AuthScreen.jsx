import { Route, Routes } from "react-router-dom"
import Footer from "../../common/Footer/Footer";
import Header from "../../common/Header/Header";
import Navbar from "../../common/Header/Navbar";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";

const AuthScreen = ({ children }) => {
    return (
        <>
            <main className="main-content overflow-x-hidden position-relative max-height-vh-100 h-100 border-radius-lg ">
                {children}
            </main>
            <ToastContainer />
            <Helmet>
            </Helmet>
        </>
    );
}

export default AuthScreen;
