import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "../../common/Footer/Footer";
import Header from "../../common/Header/Header";
import Navbar from "../../common/Header/Navbar";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

const Dashboard = ({ children, heading_title }) => {
  return (
    <>
      <Header />
      <main className="ml-[255px]">
        <Navbar heading_title={heading_title} />
        <div className="innerBox">
          <div style={{ minHeight: "85vh" }}>
            {/* {children} */}
            <Outlet />
          </div>
        </div>
      </main>
      {/* <Footer /> */}
      <ToastContainer />
    </>
  );
};

export default Dashboard;
