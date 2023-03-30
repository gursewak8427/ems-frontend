import { useEffect, useState } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import Login from "./users/admin/Pages/Login";
import AgentLogin from "./users/agent/Pages/AgentLogin";
import AgentRegister from "./users/agent/Pages/AgentRegister";
import StudentLogin from "./users/student/Pages/StudentLogin";
import StudentRegister from "./users/student/Pages/StudentRegister";
import Logo_a from "./images/log_a.png";
import Loginslider from "../src/users/website/Components/Loginslider";

const Home = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState({
    page: props.isAdmin ? 1 : 2,
    wait: true,
    redirect: searchParams.get("redirect"),
    type: searchParams.get("type"),
    school: searchParams.get("school"),
    program: searchParams.get("program"),
  });

  useEffect(() => {
    if (props.token) {
      window.location.href = "/d/admin/";
      return;
    }
    let user = searchParams.get("user");
    if (user == "student") {
      setState({
        ...state,
        page: 3,
        wait: false,
      });
    } else {
      setState({
        ...state,
        wait: false,
      });
    }
  }, []);

  const setPage = (page) => {
    setState({
      ...state,
      page,
    });
  };

  if (state.wait) {
    return (
      <center className="bg-white flex h-screen items-center justify-center">
        <img
          width={"500px"}
          src="https://miro.medium.com/max/1400/1*Gvgic29bgoiGVLmI6AVbUg.gif"
        />
      </center>
    );
  }
  return (
    <>
      <div className="loginSelectionDiv lg:flex">
        <div className="flex items-center left-log lg:w-1/2 relative">
          <div className="logo-side absolute flex  w-full">
            <img src={Logo_a} />
          </div>
          <Loginslider />
        </div>
        <div className="ryt-log lg:w-1/2">
          <div className="bg-blue flex items-center flex-col">
            {/* Logo
                            <Link to={"/"}><img src="/assets/img/logo-main.png" width={"150px"} alt="" className="mb-4" /></Link> */}
            {/* <h1 className="text-center text-[35px] font-bolder mb-3"><b>Login</b></h1> */}
            {!props.isAdmin && (
              <div className="flex items-center loginTabs">
                <span
                  className={`${
                    state.page == 2 || state.page == 4 ? "active" : ""
                  } rounded text-black w-[80px] m-2 p-2 text-white text-center`}
                  onClick={() => setPage(2)}
                >
                  Agent
                </span>
                <span
                  className={`${
                    state.page == 3 || state.page == 5 ? "active" : ""
                  } rounded text-[#000  ] w-[80px] m-2 p-2 text-white text-center`}
                  onClick={() => setPage(3)}
                >
                  Student
                </span>
              </div>
            )}
          </div>
          <div className="main-login-box justify-center items-center">
            {state.page == 1 ? (
              <Login setPage={setPage} role={props.role} /> //Admin
            ) : state.page == 2 ? (
              <AgentLogin setPage={setPage} />
            ) : state.page == 3 ? (
              <StudentLogin
                setPage={setPage}
                redirect={state.redirect}
                type={state.type}
                school={state.school}
                program={state.program}
              />
            ) : state.page == 4 ? (
              <AgentRegister setPage={setPage} />
            ) : (
              state.page == 5 && (
                <StudentRegister
                  setPage={setPage}
                  redirect={state.redirect}
                  type={state.type}
                  school={state.school}
                  program={state.program}
                />
              )
            )}
          </div>
        </div>
      </div>
      {!props.isAdmin && <Outlet />}
    </>
  );
};

export default Home;
