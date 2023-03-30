import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const Notifications = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const [state, setState] = useState({
        isWaiting: false,
        notifications: [],
        adminToken: getToken("admin"),
    })

    useEffect(() => {
        getPaginationData(1);
    }, [])


    const getPaginationData = (page) => {
        // get all agents
        setState({
            ...state,
            isWaiting: true,
        })
        let data = { currentPage: page }
        const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
        axios.post(process.env.REACT_APP_NODE_URL + "/admin/getnotifications", data, config).then(res => {
            console.log(res)
            // authenticate with token
            // redirect
            setState({
                ...state,
                isWaiting: false,
                notifications: res.data.details.notifications

            })

        }).catch(err => {
            console.log(err)
            // alert(err.response.data.message)
        })
    }

    const toggleStatus = (agentId, index) => {
        let oldAgents = state.agents
        if (oldAgents[index].status == "APPROVED") {
            oldAgents[index].status = "UN_APPROVED";
        } else {
            oldAgents[index].status = "APPROVED";
        }
        console.log({ oldAgents })
        setState({
            ...state,
            agents: oldAgents
        })
        let count = parseInt(document.getElementById("totalAgentsUnapproved").innerText)
        if (oldAgents[index].status == "UN_APPROVED") {
            document.getElementById("totalAgentsUnapproved").innerText = count + 1
        } else {
            document.getElementById("totalAgentsUnapproved").innerText = count - 1
        }
        let data = { agentId }
        axios.post(process.env.REACT_APP_NODE_URL + "/admin/togglestatus", data).then(res => {
            console.log(res)
            // authenticate with token
            // redirect
        }).catch(err => {
            console.log(err.response.data)
            // alert(err.response.data.message)
        })
    }

    return (
        <>
            <div heading_title={"Notifications"}>
                <>
                    <div className="row px-4">
                        <div className="w-full">
                            <div className="shadow-lg mb-4 mt-4">
                                <div className="px-0 pt-0 pb-2">
                                    <div className="top-notification-box">
                                        <button>Read All</button>
                                    </div>
                                    <div className="table-responsive p-0">
                                        {
                                            state.isWaiting ? "Loading..." :
                                                <table className="table w-full mb-0">
                                                    {/* <thead>
                                                        <tr>
                                                            <th className="">Id</th>
                                                            <th className="text-left p-3">Notification</th>
                                                            <th className="text-secondary opacity-7" />
                                                        </tr>
                                                    </thead> */}
                                                    <tbody>
                                                        {
                                                            state.notifications.map((notification, index) => {
                                                                return <tr>
                                                                    <td>
                                                                        <p className="text-xs text-center font-weight-bold mb-0">{index + 1}</p>
                                                                        {/* <p className="text-xs text-secondary mb-0"><b>ID:</b> {agent._id}</p> */}
                                                                    </td>
                                                                    <td className="unread notificationDiv flex">
                                                                        <div className="unreadBox">
                                                                            New
                                                                        </div>
                                                                        <div className="left">
                                                                            <h2 onClick={()=>navigate(notification.redirectUrl)}>{notification.message}</h2>
                                                                            <small><p>{notification.body}</p></small>
                                                                        </div>
                                                                        <div className="right">
                                                                            <small><p className="text-right">{(() => (new Date(parseInt(notification.created))).toLocaleString())()}</p></small>
                                                                        </div>
                                                                    </td>
                                                                    <td></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                        }
                                    </div>
                                </div>
                                <div className="card-footer pb-0">
                                    {/* pagination is here */}
                                    <div className="pagination">
                                        <div className="pages">
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel="next"
                                                onPageChange={(event) => {
                                                    getPaginationData(event.selected + 1)
                                                }}
                                                pageRangeDisplayed={2}
                                                pageCount={state.totalPages}
                                                previousLabel="prev"
                                                renderOnZeroPageCount={null}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    )
}

export default Notifications;