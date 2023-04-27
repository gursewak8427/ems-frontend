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

const MyTeams = () => {
  const [state, setState] = useState({
    isWait: true,
    list: [],
    userId: "",
  });

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
    axios
      .get(process.env.REACT_APP_NODE_URL + "/teams/getMyTeams", config)
      .then((teamResponse) => {
        console.log(teamResponse);
        if (teamResponse.data.status == "1") {
          setState({
            ...state,
            list: teamResponse.data.details.teams,
            userId: teamResponse.data.details.userId,
            isWait: false
          });
        }
      }, []);
  }, []);



  if (state.isWait) {
    return "Loading..."
  }

  return (
    <>
      <div heading_title={"Add MyTeams"}>
        <div className="flex">
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
                            Team Name
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Position
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Project Manager
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
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.list.map((team, index) => {
                          return (
                            <tr class="bg-gray-100 border-b">
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                <Link to={`/d/admin/team-tasks/${team._id}`}>{team.team_name}</Link>
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {
                                  team?.team_leader_ids?.some(item => item.user_id._id == state.userId) ? <span className="text-[green]">Team Leader</span> : <span className="text-[orange]">Team member</span>}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {team.project_manager_id.email}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {team?.team_leader_ids?.length || 0}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {team?.employee_ids?.length || 0}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <i
                                  class="fa-solid fa-trash cursor-pointer"
                                  onClick={() => null}
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

export default MyTeams;
