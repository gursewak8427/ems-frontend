import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, logoutHelper } from "../../../../helper/auth";

const StudentNavbar = ({ heading_title }) => {
    const [showDropDown, setShowDropDown] = useState(false)
    const [state, setState] = useState({
        studentToken: false,
        isWaiting: true,
    })

    useEffect(() => {
        let token = getToken("student")
        setState({
            ...state,
            studentToken: token,
            isWaiting: false
        })
    }, [])

    return (
        <>
            <nav className="">
                <div className="flex p-3 flex-row justify-between items-center bg-[#e2e8f0]">
                    <span className="breadcrumb flex items-center justify-center">
                        <h6 className="font-bold flex items-center justify-center text-[#2a276b] mb-0">{heading_title || ""}</h6>
                    </span>
                    <div>
                        <ul className="flex items-center justify-center">
                            {/* <li className="flex items-center justify-center">
                                {
                                    state.isWaiting ? <><div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div></> : state.studentToken ?
                                        <button className="py-2 px-4 bg-[#b91c1c] text-white font-semibold rounded-lg shadow-md hover:bg-[#7f1d1d] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={() => logoutHelper("student")}>
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
                                <a href="javascript:void(0);" className="nav-link text-body p-0" id="iconNavbarSidenav">
                                    <div className="sidenav-toggler-inner">
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item notificationCount dropdown mx-3 pe-2 d-flex align-items-center">
                                <Link to={"/d/student/notifications"}>
                                    <span id="notificationCountSpan">0</span>
                                    <i className="fa fa-bell cursor-pointer" />
                                </Link>
                            </li>
                            <div className="relative inline-block text-left navbar-profile-dropdown">
                   
                   <div className={`overlay ${!showDropDown ? "hidden" : "show"}`}
                       onClick={() => setShowDropDown(!showDropDown)}
                   >
                   </div>
                   <div>
                   
                       <img
                           onClick={() => setShowDropDown(!showDropDown)}
                           src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                           class="w-12 rounded-full cursor-pointer hover:shadow-lg avatar"
                           alt="Avatar" />
                   </div>
                   <div className={`absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!showDropDown && "hidden"}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                       <div onClick={() => setShowDropDown(!showDropDown)} className="py-1" role="none">
                           {/* Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" */}
                           <Link to={"/d/student/profile"}   className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0">Profile</Link>
                           <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-1">Settings</a>
                       </div>
                      
                       <div className="py-1" role="none">
                           <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} onClick={() => logoutHelper("student")} id="menu-item-6">Logout</a>
                       </div>
                   </div>
               </div>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default StudentNavbar;