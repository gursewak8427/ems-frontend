import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import Header from "./users/admin/common/Header/Header";
import Navbar from "./users/admin/common/Header/Navbar";
import Dashboard from "./users/admin/Screens/Dashboard/Dashboard";
import { requestForToken } from "./firebase";
import Notification from "./common/Notifications";
import StudentForgot from "./users/student/common/StudentForgot";
import IntakesManagement from "./users/admin/Pages/IntakesManagement";
// import DataTable from "./users/admin/Pages/DataTable";
import SchoolUpdate from "./users/admin/Pages/SchoolUpdate";
import AssessmentForms from "./users/admin/Pages/AssessmentForms";
import SearchQueryForms from "./users/admin/Pages/SearchQueryForms";
import StudentEnrolled from "./users/student/Pages/StudentEnrolled";
import StudentDocuments from "./users/student/Pages/StudentDocuments";
import AdminStudentProfile from "./users/admin/Pages/AdminStudentProfile";
import StudentNotifications from "./users/student/Pages/StudentNotifications";
import StudentHistory from "./users/student/Pages/StudentHistory";
import StudentRemarks from "./users/student/Pages/StudentRemarks";
import FilesList from "./users/admin/Pages/FilesList";
import Login2 from "./users/admin/Pages/Login2";

import Login3 from "./users/admin/Pages/Login3";

import { Profile } from "./users/admin/Pages/Pofile";
import AgentFindProgram from "./users/agent/Pages/AgentFindPrograms";
import AgentProgramsList from "./users/agent/Pages/AgentProgramsList";
import { StudentProfile } from "./users/student/Pages/StudentProfile";
import { Security } from "./users/admin/Pages/Security";
import Wabout from "./users/website/Pages/Wabout";
import Wdiscover from "./users/website/Pages/Wdiscover";
import Wcontact from "./users/website/Pages/Wcontact";
import AgentSubProgramsList from "./users/agent/Pages/AgentSubProgramsList";
import AgentEnrolledList from "./users/agent/Pages/AgentEnrolledList";
import AgentStudentDocuments from "./users/agent/Pages/AgentStudentDocuments";
import Wcountry1 from "./users/website/Pages/Wcountry1";
import Wviewdetails from "./users/website/Pages/Wviewdetails";
import AgentStudentRemarks from "./users/agent/Pages/AgentStudentRemarks";
import AddCurrency from "./users/admin/Pages/AddCurrency";
import ProgramUpdate from "./users/admin/Pages/ProgramUpdate";
import AdminStudentRemarks from "./users/admin/Pages/AdminStudentRemarks";
import Roles from "./users/admin/Pages/Roles";
import Employees from "./users/admin/Pages/Employees";
import Teams from "./users/admin/Pages/Teams";
import Tasks from "./users/admin/Pages/Tasks";
import MyTeams from "./users/admin/Pages/MyTeams";
import TeamTasks from "./users/admin/Pages/TeamTasks";
import Attendance from "./users/admin/Pages/Attendance";

// web-socket
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3006";
// console.log("COnnecting")
// const socket = socketIOClient(ENDPOINT);

const App = () => {
  const roleFromUrl = window.location.href.split("/")[4];
  const [state, setState] = useState({
    wait: true,
    tokenAdmin: false,
    tokenAgent: false,
    tokenStudent: false,
    currentPermissions: [],
  });

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
    setState({
      ...state,
      wait: false,
      currentPermissions: "ALLOW",
      tokenAdmin,
      tokenAgent,
      tokenStudent,
    });
  }, []);

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
      <Notification />
      <Routes>
        <Route path="/d/" element={<Login2 />} />
        <Route path="/d/adminlogin123" element={<Login2 />} />
        <Route path="/d/admin/forgot/:token" element={<Login2 />} />

        {/* <Route path="/d/" element={<Home isAdmin={false} />} />
        <Route
          path="/d/adminlogin123"
          element={
            <Home isAdmin={true} role="ADMIN" token={state.tokenAdmin} />
          }
        /> */}

        <Route path="/d/admin" element={<Dashboard />}>
          <Route
            index
            element={
              <ProtectedRoute token={state.tokenAdmin} role={"admin"}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute token={state.tokenAdmin} role={"admin"}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute token={state.tokenAdmin} role={"admin"}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="security"
            element={
              <ProtectedRoute token={state.tokenAdmin} role={"admin"}>
                <Security />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <Teams />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-teams"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <MyTeams />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-tasks/:teamId"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <TeamTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="tasks"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="attendance"
            element={
              <ProtectedRoute
                token={state.tokenAdmin}
                role={"admin"}
                permissions={state.currentPermissions}
                permission_name={"student_list"}
              >
                <Attendance />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* website routes */}
        <Route path="/" element={<WHome />} />
        <Route path="/eligible" element={<WEligible />} />
        <Route path="/search/:query" element={<WSearch />} />
        <Route path="/about" element={<Wabout />} />
        <Route path="/discover" element={<Wdiscover />} />
        <Route path="/contact" element={<Wcontact />} />
        <Route path="/countries" element={<Wcountry1 />} />
        <Route path="/viewdetails" element={<Wviewdetails />} />

        {/* <Route path="/" element={<Home />} /> */}

        {/* dashboard Routes */}
        {/* <Route path="/d/" element={<Home isAdmin={false} />} />
        <Route path="/d/adminlogin123" element={<Home isAdmin={true} role="ADMIN" token={state.tokenAdmin} />} /> */}

        {/* admin routes */}
        {/* <Route path="/d/admin/login" element={<Login />} /> */}

        {/* agent routes */}
        <Route path="/d/agent" element={<AgentDashboard />}>
          <Route index element={<>Dashbaord page</>} />
          <Route path="dashboard" element={<>Dashbaord page</>} />
          <Route path="login" element={<AgentLogin />} />
          <Route path="register" element={<AgentRegister />} />
          <Route path="addstudent" element={<AgentAddStudent />} />
          <Route path="getstudents" element={<AgentGetStudent />} />
          <Route path="enrolled-list" element={<AgentEnrolledList />} />
          <Route path="findprograms" element={<AgentFindProgram />} />
          <Route
            path="documents/:studentId"
            element={<AgentStudentDocuments />}
          />
          <Route path="remarks/:fileId" element={<AgentStudentRemarks />} />

          <Route
            path="findprograms/search/:query"
            element={<AgentProgramsList />}
          />
          <Route
            path="findprograms/search/p/:schoolId"
            element={<AgentSubProgramsList />}
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute token={state.tokenAgent} role={"agent"}>
                <AgentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute token={state.tokenAgent} role={"agent"}>
                <AgentNotifications />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* student routes */}
        <Route path="/d/student/confirm/:token" element={<StudentConfirm />} />

        <Route path="/login2" element={<Login2 />} />
        <Route path="/d/student/forgot/" element={<StudentForgot />} />
        <Route path="/d/student/forgot/:token" element={<Login3 />} />

        <Route path="/d/student" element={<StudentDashboard />}>
          <Route index element={<StudentEnrolled />} />
          <Route path="profile" element={<StudentProfile />} />
          {/* <Route
            path="dashboard"
            element={
              <ProtectedRoute token={state.tokenStudent} role={"student"}>
                {
                  <>
                    {" "}
                    <h1 className="text-xl m-3 font-black">Dashboard</h1>{" "}
                  </>
                }
              </ProtectedRoute>
            }
          /> */}
          {/* <Route path="login" element={<StudentLogin />} />
          <Route path="register" element={<StudentRegister />} /> */}
          <Route path="enrolled" element={<StudentEnrolled />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="history" element={<StudentHistory />} />
          <Route path="remarks/:fileId" element={<StudentRemarks />} />

          <Route path="login2" element={<Login2 />} />
        </Route>

        {/* <Route path="*" element={<><center className="pt-5 text-danger text-bold text-decoration-underline">404 Not Found</center></>} /> */}
      </Routes>
    </>
  );
};

export default App;
