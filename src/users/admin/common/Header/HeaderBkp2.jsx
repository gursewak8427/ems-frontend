import React, { useEffect } from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [active, setActive] = useState("Dashboard");
    useEffect(() => {
        setActive(window.location.pathname.split("/")[2])
    }, [window.location.href])

    const sidebarItems = [
        {
            label: "Dashboard",
            icon: <><i class="fa-solid fa-chart-line"></i></>,
            path: "/admin/dashboard",
            matchings: [""]
        },
        {
            label: "Schools",
            icon: <i class="fa-solid fa-school"></i>,
            path: "/admin/schools",
        },
        {
            label: "CSV Upload",
            icon: <i class="fa-solid fa-file-csv"></i>,
            path: "/admin/addschools",
        },
        {
            label: "Agents",
            icon: <i class="fa-solid fa-person-rays"></i>,
            path: "/admin/manage",
            matchings: ["agent_students"],
            items2: [
                {
                    label: "All Agents",
                    icon: <DashboardIcon />,
                    path: "/admin/manage",
                    matchings: ["agent_students"],
                },
                {
                    label: "Unapproved Agents",
                    icon: <DashboardIcon />,
                    path: "/admin/manage?status=unapproved",
                }
            ]
        },
        // {
        //     label: "Students",
        //     icon: <i class="fa-solid fa-graduation-cap"></i>,
        //     path: "/admin/students",
        // },
    ]
    
    return <>wait</>

    return (
        <>
            <aside className="sidenav navbar navbar-vertical navbar-expand-xs fixed-start" id="sidenav-main">
                <div className="sidenav-header">
                    <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav" />
                    <a className="navbar-brand m-0" href=" https://demos.creative-tim.com/soft-ui-dashboard/pages/dashboard.html " target="_blank">
                        <img src="../assets/img/logo-main.png" className="navbar-brand-img h-100" alt="main_logo" />
                    </a>
                    {/* <span className="font-weight-bold">
                        <center><span>ADMIN</span></center>
                    </span> */}
                </div>
                <hr className="horizontal dark mt-0" />
                <div className="w-auto " id="sidenav-collapse-main">
                    <ul className="navbar-nav">
                        {
                            sidebarItems.map(item => {
                                // if (item?.items) {
                                //     item?.items.map(subItem => {
                                //         console.log("subItem")
                                //         console.log(subItem)
                                //         return <li className="nav-item">
                                //             <Link className={active == subItem.path.split("/")[2] || subItem?.matchings?.includes(active) ? "nav-link active" : "nav-link"} to={subItem.path}>
                                //                 <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                //                     {subItem.icon}
                                //                 </div>
                                //                 <span className="nav-link-text ms-1">{subItem.label}</span>
                                //             </Link>
                                //         </li>
                                //     })
                                //     return;
                                // }
                                return <li className="nav-item">
                                    <Link className={active == item?.path?.split("/")[2] || item?.matchings?.includes(active) ? "nav-link active" : "nav-link"} to={item?.path}>
                                        <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                            {item.icon}
                                        </div>
                                        <span className="nav-link-text ms-1">{item.label}</span>
                                    </Link>
                                </li>
                            })
                        }
                        {/* header line */}
                        {/* <li className="nav-item mt-3">
                            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Account pages</h6>
                        </li> */}
                    </ul>
                </div>
            </aside>
        </>
    )
}

export default Header;