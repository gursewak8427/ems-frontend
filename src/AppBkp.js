import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./common/ProtectedRoute";
import { getToken } from "./helper/auth";
import Home from "./Home";
import AddSchools from "./users/admin/Pages/AddSchools";
import AdminSubStudents from "./users/admin/Pages/AdminSubStudents";
import DashboardPage from "./users/admin/Pages/DashboardPage";
import Login from "./users/admin/Pages/Login";
import Manage from "./users/admin/Pages/Manage";
import ProgramsList from "./users/admin/Pages/ProgramsList";
import SchoolList from "./users/admin/Pages/SchoolList";
import StudentList from "./users/admin/Pages/StudentList";
import AgentAddStudent from "./users/agent/Pages/AgentAddStudent";
import AgentGetStudent from "./users/agent/Pages/AgentGetStudent";
import AgentLogin from "./users/agent/Pages/AgentLogin";
import AgentProfile from "./users/agent/Pages/AgentProfile";
import AgentRegister from "./users/agent/Pages/AgentRegister";
import AgentDashboard from "./users/agent/Screens/Dashboard/AgentDashboard";
import StudentConfirm from "./users/student/common/StudentConfirm";
import StudentLogin from "./users/student/Pages/StudentLogin";
import StudentRegister from "./users/student/Pages/StudentRegister";
import StudentDashboard from "./users/student/Screens/Dashboard/StudentDashboard";
import AddCountry from "./users/admin/Pages/AddCountry";
import AddSchoolsName from "./users/admin/Pages/AddSchoolName";
import Notifications from "./users/admin/Pages/Notifications";


// import WebsiteHome from "./users/website/screens/WebsiteMain";
import WHome from "./users/website/Pages/WHome";
import WEligible from "./users/website/Pages/WEligible";
import WSearch from "./users/website/Pages/WSearch";
import axios from "axios";
import AdminAgentProfile from "./users/admin/Pages/AdminAgentProfile";
import AgentNotifications from "./users/agent/Pages/AgentNotifications";
import CreateEmployee from "./users/admin/Pages/CreateEmployee";
import EmployeeList from "./users/admin/Pages/EmployeeList";
import Header from "./users/website/Components/Header";

// web-socket
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3006";
// console.log("COnnecting")
// const socket = socketIOClient(ENDPOINT);


const App = () => {
  const roleFromUrl = window.location.href.split("/")[4]
  const [state, setState] = useState({
    wait: true,
    tokenAdmin: false,
    tokenAgent: false,
    tokenStudent: false,
    currentPermissions: []
  })


  // useEffect(() => {
  //   socket.on("FromAPI", data => {
  //     console.log(data)
  //   });
  // }, []);

  useEffect(() => {
    let tokenAdmin = getToken("admin");
    let tokenAgent = getToken("agent");
    let tokenStudent = getToken("student");

    // get Permissions
    var myToken;
    if (roleFromUrl == "admin") {
      myToken = tokenAdmin;
    }
    const config = { headers: { "Authorization": `Bearer ${myToken}` } }
    axios.post(process.env.REACT_APP_NODE_URL + "/admin/verifyToken", {}, config).then(res => {
      console.log({ res })
      if (res.data.status == "0") {
        setState({
          ...state,
          wait: false,
          currentPermissions: "ALLOW",
          tokenAdmin,
          tokenAgent,
          tokenStudent,
        })
        return;
      }
      if (res.data.details.userData.role != "ADMIN") {
        setState({
          ...state,
          currentPermissions: res.data.details.userData.permissions,
          wait: false,
          tokenAdmin,
          tokenAgent,
          tokenStudent,
        })
        return;
      }

      setState({
        ...state,
        currentPermissions: "ALLOW",
        wait: false,
        tokenAdmin,
        tokenAgent,
        tokenStudent,
      })
      return;
    }).catch(err => {
      console.log(err.response.data)
    })
  }, [])

  if (state.wait) {
    return (
      <center className="bg-white flex h-screen items-center justify-center">
        <img width={"500px"} src="https://miro.medium.com/max/1400/1*Gvgic29bgoiGVLmI6AVbUg.gif" />
      </center>
    )
  }
  return (
    <>
      <Route path="d" element={<Home />}>
        <Route path="profile" element={<Profile />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Routes>
        {/* website routes */}
        <Route path="/" element={<WHome />} />
        <Route path="/eligible" element={<WEligible />} />
        <Route path="/search/:query" element={<WSearch />} />

        {/* <Route path="/" element={<Home />} /> */}

        {/* dashboard Routes */}
        <Route path="/d/" element={<Home isAdmin={false} />} />
        <Route path="/d/adminlogin123" element={<Home isAdmin={true} role="ADMIN" token={state.tokenAdmin} />} />

        {/* admin routes */}
        {/* <Route path="/d/admin/login" element={<Login />} /> */}
        <Route path="/d/admin" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"}><DashboardPage /></ProtectedRoute>} />
        <Route path="/d/admin/dashboard" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"}><DashboardPage /></ProtectedRoute>} />
        <Route path="/d/admin/students" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"student_list"}><StudentList /></ProtectedRoute>} />
        <Route path="/d/admin/manage" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"csv_programs"}><Manage /></ProtectedRoute>} />
        <Route path="/d/admin/agentprofile" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"}><AdminAgentProfile /></ProtectedRoute>} />
        <Route path="/d/admin/schools" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"sp_list"}><SchoolList /></ProtectedRoute>} />
        <Route path="/d/admin/programs/:id" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"sp_list"}><ProgramsList /></ProtectedRoute>} />
        <Route path="/d/admin/addschools" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"csv_programs"}><AddSchools /></ProtectedRoute>} />
        <Route path="/d/admin/agent_students/:agentId" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"csv_programs"} ><AdminSubStudents /></ProtectedRoute>} />
        <Route path="/d/admin/addcountry" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"sp_country_names"} ><AddCountry /></ProtectedRoute>} />
        <Route path="/d/admin/addschoolname" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"sp_school_names"}><AddSchoolsName /></ProtectedRoute>} />
        <Route path="/d/admin/createemployee" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"employee_create"}><CreateEmployee /></ProtectedRoute>} />
        <Route path="/d/admin/listemployee" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions} permission_name={"employee_list"}><EmployeeList /></ProtectedRoute>} />
        <Route path="/d/admin/notifications" element={<ProtectedRoute token={state.tokenAdmin} role={"admin"} permissions={state.currentPermissions}><Notifications /></ProtectedRoute>} />

        {/* agent routes */}
        <Route path="/d/agent" element={<ProtectedRoute token={state.tokenAgent} role={"agent"}><AgentDashboard /></ProtectedRoute>} />
        <Route path="/d/agent/dashboard" element={<ProtectedRoute token={state.tokenAgent} role={"agent"}><AgentDashboard /></ProtectedRoute>} />
        <Route path="/d/agent/login" element={<AgentLogin />} />
        <Route path="/d/agent/register" element={<AgentRegister />} />
        <Route path="/d/agent/addstudent" element={<AgentAddStudent />} />
        <Route path="/d/agent/getstudents" element={<AgentGetStudent />} />
        <Route path="/d/agent/profile" element={<ProtectedRoute token={state.tokenAgent} role={"agent"}><AgentProfile /></ProtectedRoute>} />
        <Route path="/d/agent/notifications" element={<ProtectedRoute token={state.tokenAgent} role={"agent"}><AgentNotifications /></ProtectedRoute>} />

        {/* student routes */}
        <Route path="/d/student" element={<ProtectedRoute token={state.tokenStudent} role={"student"}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/d/student/dashboard" element={<ProtectedRoute token={state.tokenStudent} role={"student"}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/d/student/login" element={<StudentLogin />} />
        <Route path="/d/student/register" element={<StudentRegister />} />
        <Route path="/d/student/confirm/:token" element={<StudentConfirm />} />
        {/* <Route path="*" element={<><center className="pt-5 text-danger text-bold text-decoration-underline">404 Not Found</center></>} /> */}
      </Routes>
    </>
  );
}

export default App;
