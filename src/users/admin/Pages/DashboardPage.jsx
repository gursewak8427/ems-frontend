import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Dashboard from "../Screens/Dashboard/Dashboard";

const DashboardPage = () => {
    const navigate = useNavigate()
    const [state, setState] = useState({
        totalAgents: null,
        approvedAgents: null,
        unApprovedAgents: null,
        agentStudents: null,
        totalStudents: null,
        blockStudents: null,
        unBlockStudents: null,
        totalSchools: null,
        totalPrograms: null,
    })
    useEffect(() => {
        // get getDashboardCounts api to get dashboard counts
        axios.get(process.env.REACT_APP_NODE_URL + "/admin/getDashboardCounts").then(res => {
            console.log(res)
            setState({
                ...state,
                totalAgents: res.data.details.totalAgents,
                approvedAgents: res.data.details.approvedAgents,
                unApprovedAgents: res.data.details.unApprovedAgents,
                agentStudents: res.data.details.agentStudents,
                totalStudents: res.data.details.totalStudents,
                blockStudents: res.data.details.blockStudents,
                unBlockStudents: res.data.details.unBlockStudents,
                totalSchools: res.data.details.totalSchools,
                totalPrograms: res.data.details.totalPrograms,
            })
        }).catch(err => {
            console.log(err.response.data)
        })
    }, [])
    return (
        <>
            <div heading_title={"Dashboard"}>
                <div className="dashboardItemsList">
                    <div class="card dashboardItem" onClick={() => navigate("/d/admin/manage")}>
                        <h5 class="card-title text-bold">
                            {
                                state.totalAgents == null ? "--" : state.totalAgents == -1 ? "--" : state.totalAgents
                            }
                        </h5>
                        <p class="card-text">Total Users</p>
                        <i class="fa-solid fa-users"></i>
                    </div>
                    {/* <div class="card dashboardItem">
                        <h5 class="card-title text-bold">
                            {
                                state.approvedAgents == null ? "--" : state.approvedAgents == -1 ? "--" : state.approvedAgents
                            }
                        </h5>
                        <p class="card-text">Approved Agent</p>
                        <i class="fa-solid fa-person-circle-check"></i>
                    </div>
                    <div class="card dashboardItem">
                        <h5 class="card-title text-bold">
                            {
                                state.unApprovedAgents == null ? "--" : state.unApprovedAgents == -1 ? "--" : state.unApprovedAgents
                            }
                        </h5>
                        <p class="card-text">Unapproved Agent</p>
                        <i class="fa-solid fa-thumbs-down"></i>
                    </div> */}
                    <div class="card dashboardItem" onClick={() => navigate("/d/admin/manage")}>
                        <h5 class="card-title text-bold">
                            {
                                state.agentStudents == null ? "--" : state.agentStudents == -1 ? "--" : state.agentStudents
                            }
                        </h5>
                        <p class="card-text">Total Tasks</p>
                        <i class="fa-solid fa-users-viewfinder"></i>
                    </div>
                    <div class="card dashboardItem" onClick={() => navigate("/d/admin/students")}>
                        <h5 class="card-title text-bold">
                            {
                                state.totalStudents == null ? "--" : state.totalStudents == -1 ? "--" : state.totalStudents
                            }
                        </h5>
                        <p class="card-text">Pending Tasks</p>
                        <i class="fa-solid fa-graduation-csap"></i>
                    </div>
                    {/* <div class="card dashboardItem">
                        <h5 class="card-title text-bold">
                            {
                                state.blockStudents == null ? "--" : state.blockStudents == -1 ? "--" : state.blockStudents
                            }
                        </h5>
                        <p class="card-text">Block Student</p>
                        <i class="fa-solid fa-circle-minus"></i>
                    </div>
                    <div class="card dashboardItem">
                        <h5 class="card-title text-bold">
                            {
                                state.unBlockStudents == null ? "--" : state.unBlockStudents == -1 ? "--" : state.unBlockStudents
                            }
                        </h5>
                        <p class="card-text">Unblock Student</p>
                        <i class="fa-solid fa-face-smile-beam"></i>
                    </div> */}
                    <div class="card dashboardItem" onClick={() => navigate("/d/admin/schools")}>
                        <h5 class="card-title text-bold">
                            {
                                state.totalSchools == null ? "--" : state.totalSchools == -1 ? "--" : state.totalSchools
                            }
                        </h5>
                        <i class="fa-solid fa-school-circle-check"></i>
                        <p class="card-text">Today Present Users</p>
                    </div>
                    <div class="card dashboardItem" onClick={() => navigate("/d/admin/programs")}>
                        <h5 class="card-title text-bold">
                            {
                                state.totalPrograms == null ? "--" : state.totalPrograms == -1 ? "--" : state.totalPrograms
                            }
                        </h5>
                        <p class="card-text">Today Absent Users</p>
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;