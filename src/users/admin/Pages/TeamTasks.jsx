import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useParams } from "react-router-dom";
import { getCookie, getToken, setCookie } from "../../../helper/auth";
import Papa from "papaparse";
import Dashboard from "../Screens/Dashboard/Dashboard";
// import "./AddCountry.css";
import { useDropzone } from "react-dropzone";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

// web-socket
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3006";
// console.log("COnnecting")
// var socket = socketIOClient(ENDPOINT);

const TeamTasks = () => {
  const { teamId } = useParams()
  const [state, setState] = useState({
    isWait: true,
    list: [],
    userId: "",
    teamDetail: {},
    submit_data: ""
  });

  const [submitType, setSubmitType] = useState("FILES")
  const [files, setFiles] = useState(null)

  const [Modal, setModal] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(false);
  const [Modal2, setModal2] = useState(false);
  const [Modal3, setModal3] = useState(false);
  const [History, setHistory] = useState({});

  var config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_NODE_URL + `/tasks/getTeamTasks/${teamId}`, config)
      .then((teamResponse) => {
        console.log(teamResponse);
        if (teamResponse.data.status == "1") {
          setState({
            ...state,
            list: teamResponse.data.details.tasks,
            userId: teamResponse.data.details.userId,
            teamDetail: teamResponse.data.details.teamDetail,
            isWait: false
          });
        }
      }, []);
  }, []);



  const handleFiles = (e) => {
    setFiles(e.target.files)
  };

  if (state.isWait) {
    return "Loading..."
  }

  return (
    <>
      <div heading_title={"Add TeamTasks"}>
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
                            Team
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
                            Submit Task
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            History
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
                                {state?.teamDetail?.team_name || "--"}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {task?.team_leader_ids?.length || 0}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <br />
                                {
                                  true ? // task?.team_leader_ids?.some(item => item.user_id._id === state.userId) ?
                                    <ButtonPrimary onclick={() => {
                                      setActiveTaskIndex(index)
                                      setModal(true)
                                    }} title={`(${task?.employee_ids?.length || 0}) Manage`} /> :
                                    task?.employee_ids?.length || 0
                                }

                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                <select value={task.status} name="task_status" id="" onChange={async (e) => {
                                  task.status = e.target.value;
                                  let oldTasks = [...state.list]
                                  oldTasks[index] = task;
                                  await axios
                                    .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`, { task })
                                  setState({
                                    ...state,
                                    list: oldTasks
                                  })
                                }}>
                                  <option value="PENDING">Pending</option>
                                  <option value="ASSIGNED">Assigned</option>
                                  <option value="IN_PROCESS">In-Processing</option>
                                  <option value="SUBMITTED">Submitted</option>
                                  <option value="TESTING">Testing</option>
                                  <option value="FAILED">FAILED</option>
                                  <option value="COMPLETE">Complete</option>
                                </select>
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <ButtonPrimary title="Upload" onclick={() => {
                                  setModal2(true)
                                }} />
                                {Modal2 && (
                                  <div className="modal_cover filter_model">
                                    <div className="modal_inner select-col-popup">
                                      <div className="header_modal">
                                        <select name="submit-type" id="" value={submitType}
                                          onChange={(e) => {
                                            setSubmitType(e.target.value)
                                          }}
                                        >
                                          <option value="FILES">Files</option>
                                          <option value="LINKS">Links/Urls</option>
                                        </select>

                                        <div>
                                          {
                                            submitType === "FILES" &&
                                            <div>
                                              <input multiple onChange={handleFiles} className="my-2 rounded border-2 border-grey px-4 py-2" type="file" name="" id="" />
                                              <div>
                                                <p><b>Note: Upload Zip or Pdf Files</b></p>
                                              </div>
                                            </div>
                                          }
                                          {
                                            submitType === "LINKS" &&
                                            <div>
                                              <input onChange={(e) => {
                                                setState({
                                                  ...state,
                                                  submit_data: e.target.value
                                                })
                                              }} placeholder="http://link1.com/;http://link2.com" className="my-2 rounded border-2 border-grey px-4 py-2" type="text" id="data" />
                                              <div>
                                                <p><b>Note: Write multiple links with semicolon separated</b></p>
                                              </div>
                                            </div>
                                          }
                                        </div>

                                        <div className="my-2 w-full flex justify-end">
                                          <div className="mr-2">
                                            <ButtonPrimary theme="danger" title="Cancel" onclick={() => {
                                              setModal2(false)
                                            }} />
                                          </div>
                                          <ButtonPrimary title="Submit" onclick={async () => {
                                            const fd = new FormData();
                                            if (submitType == "FILES") {
                                              for (let index = 0; index < files.length; index++) {
                                                const file = files[index];
                                                fd.append("files", file)
                                              }
                                              fd.append("submit_data", "");
                                            } else {
                                              console.log(state.submit_data)
                                              fd.append("submit_data", state.submit_data);
                                            }
                                            fd.append("taskId", task._id);
                                            fd.append("submit_type", submitType);

                                            setState({
                                              ...state,
                                              submitProcessing: true,
                                            });
                                            let response = await axios.post(
                                              process.env.REACT_APP_NODE_URL + "/tasks/uploadData",
                                              fd
                                            );
                                            setModal2(false)
                                          }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>)
                                }
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <ButtonPrimary title="History" onclick={async () => {
                                  let response = await axios.post(
                                    process.env.REACT_APP_NODE_URL + "/tasks/getData",
                                    { taskId: task._id, }
                                  );
                                  setHistory({
                                    data: response.data.details.data,
                                    baseUrl: response.data.details.baseUrl,
                                  })
                                  setModal3(true)
                                }} />
                                {Modal3 && (
                                  <div className="modal_cover filter_model">
                                    <div className="modal_inner select-col-popup">
                                      <div className="header_modal" style={{ maxHeight: "40vh", overflow: "auto" }}>
                                        <h1 className="font-black text-xl">History or Uploaded Data</h1>

                                        {
                                          History && History.data.map(history => {
                                            return (
                                              <div key={history._id}>
                                                {history.submit_type == "LINKS" && <>
                                                  {
                                                    history.submit_data.map(myLink => {
                                                      return (
                                                        <div>
                                                          <a className="p-2 border-[darkgrey] rounded hover:bg-[grey] border-2 my-2 block" href={myLink} target="_blank" rel="noopener noreferrer"><b className="font-black">Link: </b>{myLink}
                                                            <br />
                                                            <div className="flex justify-end">
                                                              <span>{new Date(history.createdAt).toLocaleString()}</span>
                                                            </div>
                                                          </a>
                                                        </div>
                                                      )
                                                    })
                                                  }
                                                </>}

                                                {history.submit_type == "FILES" && <>
                                                  {
                                                    history.submit_data.map(myLink => {
                                                      return (
                                                        <div>
                                                          <a className="p-2 border-[darkgrey] rounded hover:bg-[grey] border-2 my-2 block" href={History.baseUrl + myLink} target="_blank" rel="noopener noreferrer"><b className="font-black">File: </b>{History.baseUrl + myLink}
                                                            <br />
                                                            <div className="flex justify-end">
                                                              <span>{new Date(history.createdAt).toLocaleString()}</span>
                                                            </div>
                                                          </a>
                                                        </div>
                                                      )
                                                    })
                                                  }
                                                </>}
                                              </div>
                                            )
                                          })
                                        }


                                      </div>
                                      <div className="my-2 w-full flex justify-end">
                                        <ButtonPrimary theme="danger" title="Close" onclick={() => {
                                          setModal3(false)
                                        }} />
                                      </div>
                                    </div>
                                  </div>)
                                }
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
                      {Modal && (
                        <div className={`${Modal ? "modal_cover filter_model" : "modal_cover filter_model hidden"}`}>
                          <div className="modal_inner select-col-popup">
                            <div className="header_modal">
                              <h1>Team Employees List : </h1>
                              <br />
                              <ul>
                                {
                                  // make checkboxes with labels for state?.teamDetail.employee_ids
                                  state?.teamDetail?.employee_ids?.map((teamEmp, empIndex) => {
                                    return (
                                      <li key={empIndex}>
                                        {/* {state.list[activeTaskIndex].task_name} */}
                                        <input
                                          type="checkbox"
                                          checked={state.list[activeTaskIndex]?.employee_ids?.some(item => item.user_id._id === teamEmp.user_id._id)}
                                          onChange={async () => {
                                            let oldEmpList = [...state.list[activeTaskIndex]?.employee_ids];
                                            if (oldEmpList.some(item => item.user_id._id == teamEmp.user_id._id)) {
                                              oldEmpList = oldEmpList.filter(emp => emp.user_id._id !== teamEmp.user_id._id);
                                            } else {
                                              oldEmpList.push(teamEmp);
                                            }
                                            state.list[activeTaskIndex].employee_ids = oldEmpList;
                                            let oldTasks = [...state.list]
                                            oldTasks[activeTaskIndex] = state.list[activeTaskIndex];
                                            await axios
                                              .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`, { task: state.list[activeTaskIndex] })
                                            setState({
                                              ...state,
                                              list: oldTasks
                                            })

                                          }}
                                        />
                                        <label
                                          htmlFor={teamEmp.user_id.email}
                                          className="ml-2"
                                        >
                                          {teamEmp.user_id.email}
                                        </label>
                                      </li>
                                    );
                                  })
                                }
                              </ul>
                              <div className="my-2 w-full flex justify-end">
                                <ButtonPrimary theme="danger" title="Close" onclick={() => {
                                  setModal(false)
                                }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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

export default TeamTasks;
