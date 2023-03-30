import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect } from "react-router-dom";
import { getCookie, getToken, setCookie } from "../../../helper/auth";
import Papa from "papaparse";
import Dashboard from "../Screens/Dashboard/Dashboard";
// import "./AddCountry.css";
import { useDropzone } from "react-dropzone";

// web-socket
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3006";
// console.log("COnnecting")
// var socket = socketIOClient(ENDPOINT);

const Tasks = () => {
  const [state, setState] = useState({
    taskName: "",
    taskDescription: "",
    teamsList: [],

    selectedTeamId: "",
    selectedTeamIndex: -1,
    selectedTeamLeaderIds: [],

    isWait: true,
    submitProcessing: false,
  });

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
    axios
      .get(process.env.REACT_APP_NODE_URL + "/tasks/", config)
      .then((teamResponse) => {
        if (teamResponse.data.status == "1") {
          setState({
            ...state,
            list: teamResponse.data.details.tasks,
            isWait: false
          });
        }
      });
  }, []);

  const handleChange = (e) => {

    if (e.target.name == "selectedTeamLeaderIds") {
      let selectedTeamLeaderIds = state.selectedTeamLeaderIds
      console.log(e.target.value)
      if (selectedTeamLeaderIds.includes(e.target.value)) {
        let index = selectedTeamLeaderIds.indexOf(e.target.value)
        selectedTeamLeaderIds.splice(index, 1)
      } else {
        selectedTeamLeaderIds.push(e.target.value)
      }
      setState({
        ...state,
        selectedTeamLeaderIds: selectedTeamLeaderIds
      })
    } else if (e.target.name == "selectedTeamId") {
      let index = state.teamsList.reduce((prev, t, i) => t._id == e.target.value ? i : prev, -1)
      setState({
        ...state,
        selectedTeamId: e.target.value,
        selectedTeamIndex: index
      })
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }

    console.log(state.employeeIds)
  };


  const uploadData = async () => {
    try {
      if (state.taskName == "") {
        alert("Task Name is required");
        return;
      }
      if (state.selectedTeamId == "") {
        alert("Please Select and Team");
        return;
      }
      if (state.selectedTeamLeaderIds.length == 0) {
        alert("Minimum 1 Team Leader is required");
        return;
      }
      setState({
        ...state,
        submitProcessing: true,
      });

      let apiData = {
        task_name: state.taskName,
        task_description: state.taskDescription,
        team_id: state.selectedTeamId,
        team_leader_ids: state.selectedTeamLeaderIds.map(id => { return { user_id: id } }),
      }

      const config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
      let response = await axios.post(
        process.env.REACT_APP_NODE_URL + "/tasks/create",
        apiData,
        config
      );

      alert(response.data.message);

      if (response.data.status == "1") {
        setState({
          ...state,
          list: [response.data.details.task, ...state.list],
          email: "",
          password: "",
          roleId: "",
          submitProcessing: false,
        });
      } else {
        setState({
          ...state,
          submitProcessing: false,
        });
      }

    } catch (error) {
      console.log(error);
      setState({
        ...state,
        submitProcessing: false,
      });
    }
  };

  const updateData = async () => {
    try {
      let index = state.updatedId;
      const fd = new FormData();
      fd.append("image", state.countryFlag);
      fd.append("id", state.list[index]._id);

      setState({
        ...state,
        submitProcessing: true,
      });
      let response = await axios.post(
        process.env.REACT_APP_NODE_URL + "/admin/updatecountrylogo",
        fd
      );

      console.log(response);

      if (response.data.status == "1") {
        let oldData = state.list;
        oldData[index] = response.data.details.updatedCountry;

        setState({
          ...state,
          list: oldData,
          roleTitle: "",
          countryFlag: "",
          updatedId: null,
          submitProcessing: false,
        });
      } else {
        setState({
          ...state,
          submitProcessing: false,
        });
      }

      alert(response.data.message);
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        submitProcessing: false,
      });
    }
  };

  const setDelete = (user, index) => {
    let old = state.usersList
    old.splice(index, 1)

    axios
      .delete(process.env.REACT_APP_NODE_URL + "/users/" + user._id)
      .then((response) => {
        alert(response.data.message)
        if (response.data.status == "1") {
          setState({
            ...state,
            usersList: old,
          });
        } else {
        }
      });


  };

  if (state.isWait) {
    return "Loading..."
  }

  return (
    <>
      <div heading_title={"Add Tasks"}>
        <div className="flex flex-col p-3">
          <div className="row w-full flex flex-row">
            <div className="shadow-lg w-full mx-auto my-4 p-2">
              <div className="card-body">
                <label>Task Name</label>
                <div className="mb-3">
                  <input
                    type="text"
                    className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                    name="taskName"
                    placeholder="Enter Task Name"
                    value={state.taskName}
                    onChange={handleChange}
                  />
                </div>
                <label>Task Description</label>
                <div className="mb-3">
                  <input
                    type="text"
                    className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                    name="taskDescription"
                    placeholder="Enter Task Description"
                    value={state.taskDescription}
                    onChange={handleChange}
                  />
                </div>
                <label>Select Team</label>
                <div className="">
                  <select name="selectedTeamId" onChange={handleChange}>
                    <option value="" selected>Select Team</option>
                    {
                      state.teamsList.map(team => {
                        return (
                          <option value={team._id}>
                            {team.team_name}
                          </option>
                        )
                      })
                    }
                  </select>
                </div>
                <br />
                <br />
                <label>Select Team Leaders</label>
                <div className="">
                  <ul>
                    {
                      state.selectedTeamIndex != -1 && state?.teamsList[state.selectedTeamIndex]?.team_leader_ids?.map(user => {
                        return (
                          <div>
                            <input type="checkbox" value={user?.user_id?._id} id={user?.user_id?._id} onChange={handleChange} name="selectedTeamLeaderIds" />
                            <label id={user?.user_id?._id}>{user?.user_id?.email}</label>
                          </div>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="btn bg-gradient-primary w-100 mt-4 text-white px-2 py-1 rounded mb-0"
                onClick={() =>
                  uploadData()
                }
              >
                {state.submitProcessing ? (
                  <div aria-label="Loading..." role="status">
                    <svg class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
                      <path
                        class="fill-gray-200"
                        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                      ></path>
                      <path
                        class="fill-gray-800"
                        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                      ></path>
                    </svg>
                  </div>
                ) : state.updatedId != null ? (
                  <>Update</>
                ) : (
                  <>Create</>
                )}
              </button>
              {state.updatedId != null && (
                <button
                  type="button"
                  className="btn bg-[red] w-100 ml-2 mt-4 text-white px-2 py-1 rounded mb-0"
                  onClick={removeUpdate}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          <div className="mx-auto w-full my-4 p-2">
            <div class="flex flex-col">
              <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div class="overflow-hidden">
                    <table class="min-w-full agent-table">
                      <thead class="">
                        <tr>
                          <th
                            scope="col"
                            class="text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Sr.
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Task Name
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Parent
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Team Leaders
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Employees
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.list.map((task, index) => {
                          return (
                            <tr class="bg-gray-100 border-b">
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {task?.task_name || "--"}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {task?.task_description || "--"}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {task?.parent_id?.email || "--"}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {task?.team_leader_ids?.length || 0}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {task?.employee_ids?.length || 0}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {task?.status || "--"}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <i
                                  class="fa-solid fa-trash cursor-pointer"
                                  onClick={() => setDelete(user, index)}
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
