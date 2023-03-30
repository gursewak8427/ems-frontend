import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { getToken } from '../helper/auth';

const ProtectedRoute = ({ token, role, permission_name, permissions, children }) => {
    const [state, setState] = useState({
        returnData: children,
        isWait: true,
    })
    console.log([token, role])
    let location = useLocation();
    let navigate = useNavigate();
    if (token == 'undefined' || token == undefined || token == false) {
        if (role == "admin") {
            console.log("im hre 1")
            window.location.href = "/d/"
            return;
            return navigate("/d/adminlogin123")
            // return <Navigate to="/d/adminlogin123" state={{ from: location }} replace />
        } else if (role == "agent") {
            console.log("im hre 2")
            window.location.href = "/d/"
            return;
            return navigate("/d/agent/login")
            // return <Navigate to="/d/agent/login" state={{ from: location }} replace />
        } else if (role == "student") {
            console.log("im hre 3")
            window.location.href = "/d/"
            return;
            return navigate("/d/student/login")
            // return <Navigate to="/d/student/login" state={{ from: location }} replace />
        }
    } else {
        if (!permissions || !permission_name) return children;
        if (permissions != "ALLOW") {
            if (!permissions.includes(permission_name)) {
                window.location.href = "/d/admin"
                return;
                return "Not Allowed";
            }
            return children;
        }
    }
    // useEffect(() => {
    //     if (token == 'undefined') {
    //         if (role == "admin") {
    //             console.log("im hre 1")
    //             return navigate("/d/adminlogin123")
    //             // return <Navigate to="/d/adminlogin123" state={{ from: location }} replace />
    //         } else if (role == "agent") {
    //             console.log("im hre 2")
    //             return navigate("/d/agent/login")
    //             // return <Navigate to="/d/agent/login" state={{ from: location }} replace />
    //         } else if (role == "student") {
    //             console.log("im hre 3")
    //             return navigate("/d/student/login")
    //             // return <Navigate to="/d/student/login" state={{ from: location }} replace />
    //         } else if (role == "subadmin") {
    //             console.log("im hre 4")
    //             return navigate("/d/subadmin/login")
    //             // return <Navigate to="/d/subadmin/login" state={{ from: location }} replace />
    //         }
    //     } else {
    //         setState({
    //             ...state,
    //             returnData: children,
    //             isWait: false,
    //         })
    //         // verify token
    //         // if (!permission_name) {
    //         //     setState({
    //         //         ...state,
    //         //         returnData: children,
    //         //         isWait: false,
    //         //     })
    //         //     return;
    //         // }

    //         // const config = { headers: { "Authorization": `Bearer ${token}` } }
    //         // axios.post(process.env.REACT_APP_NODE_URL + "/admin/verifyToken", {}, config).then(res => {
    //         //     console.log({ res })
    //         //     if (res.data.details.userData.role != "ADMIN") {
    //         //         console.log([res.data.details.userData.permissions, permission_name])
    //         //         if (!res.data.details.userData.permissions.includes(permission_name)) {
    //         //             console.log('not allow')
    //         //             setState({
    //         //                 ...state,
    //         //                 returnData: "Not Allowed",
    //         //                 isWait: false,
    //         //             })
    //         //             return;
    //         //         }
    //         //         console.log('allow')
    //         //         setState({
    //         //             ...state,
    //         //             returnData: children,
    //         //             isWait: false,
    //         //         })
    //         //         return;
    //         //     }

    //         //     setState({
    //         //         ...state,
    //         //         returnData: children,
    //         //         isWait: false,
    //         //     })
    //         //     return;
    //         // }).catch(err => {
    //         //     console.log(err.response.data)
    //         // })
    //     }

    // }, [])

    // if (state.isWait) {
    //     return <>Waiting...</>
    // }

    return children;
};

export default ProtectedRoute;