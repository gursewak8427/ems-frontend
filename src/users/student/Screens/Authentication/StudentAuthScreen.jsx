import { Route, Routes } from "react-router-dom"
import Footer from "../../common/Footer/StudentFooter";
import Header from "../../common/Header/StudentHeader";
import Navbar from "../../common/Header/StudentNavbar";
import { Helmet } from "react-helmet";

const StudentAuthScreen = ({ children }) => {
    return (
        <>
            <main className="main-content overflow-x-hidden position-relative max-height-vh-100 h-100 border-radius-lg ">
                <div className="">
                    {children}
                </div>
            </main>
            <Helmet>
                <script src="/assets/js/core/popper.min.js"></script>
                <script src="/assets/js/core/bootstrap.min.js"></script>
                {/* <script src="/assets/js/plugins/perfect-scrollbar.min.js"></script> */}
                <script src="/assets/js/plugins/smooth-scrollbar.min.js"></script>
                <script src="/assets/js/plugins/chartjs.min.js"></script>
                <script src="/assets/js/soft-ui-dashboard.js" type="text/javascript" />
            </Helmet>
        </>
    );
}

export default StudentAuthScreen;
