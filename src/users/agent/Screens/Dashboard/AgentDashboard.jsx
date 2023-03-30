import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Footer from "../../common/Footer/AgentFooter";
import Header from "../../common/Header/AgentHeader";
import Navbar from "../../common/Header/AgentNavbar";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useState } from "react";
import { getToken } from "../../../../helper/auth";
import axios from "axios";
import { requestForToken } from "../../../../firebase";
import { ToastContainer } from "react-toastify";

const AgentDashboard = ({ children, heading_title }) => {
  const [state, setState] = useState({
    isWait: true,
    agentPending: true,
    token: getToken("agent"),
  });

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${state.token}` } };
    requestForToken().then((token) => {
      axios
        .post(
          process.env.REACT_APP_NODE_URL + "/agent/verifyToken",
          { token },
          config
        )
        .then((res) => {
          console.log({ agentTokenStatus: res })
          if (res.data.details.agent.status != res.data.details.agent.status == "PENDING") {
            setState({
              ...state,
              isWait: false,
              agentPending: true,
            });
          } else {
            setState({
              ...state,
              isWait: false,
              agentPending: false,
            });
          }
        })
        .catch((err) => {
          setState({
            ...state,
            isWait: false,
            agentPending: true,
          });
          console.log(err.response.data);
        });
    });
  }, []);

  if (state.isWait) {
    return "Waiting is in progress...";
  } else {
    if (state.agentPending) {
      // if (window.location.href.split("/")[5] != "profile" && window.location.href.split("/")[5] != "notifications") {
      //   return <Navigate to="/d/agent/profile" replace />
      // }
    }
  }

  return (
    <>
      <Header agentPending={state.agentPending}/>
      <main className="ml-[255px]">
        <Navbar heading_title={heading_title} />
        <div className="innerBox">
          <div style={{ minHeight: "85vh" }}>
            {/* {children} */}
            <Outlet />
          </div>
        </div>
        <ToastContainer />
      </main>
    </>
  );
};

export default AgentDashboard;
