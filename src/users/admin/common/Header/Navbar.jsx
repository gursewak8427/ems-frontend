import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logoutHelper } from "../../../../helper/auth";
import axios from "axios";

const Navbar = ({ heading_title }) => {
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState(false);

  const [state, setState] = useState({
    adminToken: false,
    isWaiting: true,
  });

  const [Attendance, setAttendace] = useState(null);
  const [AttendanceLoading, setAttendaceLoading] = useState(false);

  const config = { headers: { "Authorization": `Bearer ${getToken("admin")}` } }

  useEffect(() => {
    let token = getToken("admin");
    axios.post(process.env.REACT_APP_NODE_URL + "/users/getTodayAttendace", {}, config).then((response) => {
      console.log({ response })
      if (response.data.status == "0") {
        setAttendace({
          status: "0",
          message: "PENDING"
        });
        console.log(Attendance)
      } else {
        setAttendace({
          status: "1",
          message: response.data.details.attendance.attendance
        });
      }

      setState({
        ...state,
        adminToken: token,
        isWaiting: false,
      });
    });

  }, []);

  const toggleSidebar = () => {
    document.getElementById("aside").classList.remove("hidebar");
    document.getElementById("overlay").classList.remove("hidebar");
    document.getElementById("aside").classList.toggle("hide-sidebar");
    document.getElementById("aside").classList.toggle("show");
    document.getElementById("overlay").classList.toggle("show");
    document.getElementsByTagName("main")[0].classList.toggle("hide-sidebar");
  };

  const markAttendance = () => {
    setAttendaceLoading(true)
    axios.post(process.env.REACT_APP_NODE_URL + "/users/markAttendace", {}, config).then((response) => {
      setAttendaceLoading(false)
      if (response.data.status == "1") {
        setAttendace({
          status: "1",
          message: "PRESENT"
        });
        alert("Marked successfully")
      } else {
        alert("Something went wrong")
      }
    });
  }

  return (
    <>
      <nav className="">
        <div className="flex p-3 flex-row justify-between items-center bg-[#e2e8f0]">
          <span className="breadcrumb flex items-center justify-center">
            {/* menu icon */}
            <i
              className="fas fa-bars text-xl cursor-pointer"
              onClick={toggleSidebar}
            ></i>
            {/* <h6 className="font-bold flex items-center justify-center text-[#2a276b] mb-0">{heading_title || ""}</h6> */}
          </span>
          <div>
            <ul className="flex items-center justify-center">
              {/* <li className="flex items-center justify-center">
                                {
                                    state.isWaiting ? <><div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div></> : state.adminToken ?
                                        <button className="py-2 px-4 bg-[#b91c1c] text-white font-semibold rounded-lg shadow-md hover:bg-[#7f1d1d] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={() => logoutHelper("admin")}>
                                            <i className="fa fa-sign-out me-sm-1" />
                                            <span className="d-sm-inline d-none">Logout</span>
                                        </button> :
                                        <a href="javascript:void(0);" className="nav-link text-body font-weight-bold px-0">
                                            <i className="fa fa-user me-sm-1" />
                                            <span className="d-sm-inline d-none">Login</span>
                                        </a>
                                }
                            </li> */}
              <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                <a
                  href="javascript:void(0);"
                  className="nav-link text-body p-0"
                  id="iconNavbarSidenav"
                >
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                  </div>
                </a>
              </li>
              <li className="nav-item mx-3 pe-2 d-flex align-items-center">
                {
                  (Attendance?.status == "0" || Attendance?.message == "PENDING") &&
                  <button
                    onClick={markAttendance}
                    className="focus:outline-none text-left text-black bg-[skyblue] capitalize rounded flex justify-between items-center w-full px-5 py-3 space-x-14"
                  >
                    {
                      AttendanceLoading ? "Please wait..." :
                        "Mark Attendance"
                    }
                  </button>
                }
                {
                  Attendance?.status == "1" &&
                  <button
                    className="focus:outline-none text-left text-[green] font-black uppercase rounded flex justify-between items-center w-full px-5 py-3 space-x-14"
                  >
                    {Attendance?.message}
                  </button>
                }
                {
                  Attendance?.status == "1" && Attendance?.message == "ABSENT" &&
                  <button
                    className="focus:outline-none text-left text-[red] font-black uppercase rounded flex justify-between items-center w-full px-5 py-3 space-x-14"
                  >
                    Absent
                  </button>
                }
                {
                  Attendance?.status == "1" && Attendance?.message == "LATE" &&
                  <button
                    className="focus:outline-none text-left text-[orange] font-black uppercase rounded flex justify-between items-center w-full px-5 py-3 space-x-14"
                  >
                    Late-In
                  </button>
                }
              </li>
              <li className="nav-item notificationCount dropdown mx-3 pe-2 d-flex align-items-center">
                <Link to={"/d/admin/notifications"}>
                  <span id="notificationCountSpan">0</span>
                  <i className="fa fa-bell cursor-pointer" />
                </Link>
              </li>
              <div className="relative inline-block text-left navbar-profile-dropdown">
                <div
                  className={`overlay ${!showDropDown ? "hidden" : "show"}`}
                  onClick={() => setShowDropDown(!showDropDown)}
                ></div>
                <div>
                  <img
                    onClick={() => setShowDropDown(!showDropDown)}
                    src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                    class="w-12 rounded-full cursor-pointer hover:shadow-lg avatar"
                    alt="Avatar"
                  />
                </div>
                <div
                  className={`absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!showDropDown && "hidden"
                    }`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
                >
                  <div
                    onClick={() => setShowDropDown(!showDropDown)}
                    className="py-1"
                    role="none"
                  >
                    <Link
                      to={"/d/admin/profile"}
                      className="text-gray-700 block px-4 py-2 text-sm"
                      role="menuitem"
                      tabIndex={-1}
                      id="menu-item-0"
                    >
                      Profile
                    </Link>
                    <Link
                      to={"/d/admin/security"}
                      className="text-gray-700 block px-4 py-2 text-sm"
                      role="menuitem"
                      tabIndex={-1}
                      id="menu-item-1"
                    >
                      Change Password
                    </Link>
                  </div>
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="text-[red] block px-4 py-2 text-sm"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => logoutHelper("admin")}
                      id="menu-item-6"
                    >
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
