import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect } from "react-router-dom";
import { getCookie, setCookie } from "../../../helper/auth";
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

const Roles = () => {
  const [Modal, setModal] = useState(false)
  const [activeRoleIndex, setActiveRoleIndex] = useState(-1)
  const [tempPermissions, setTempPermissions] = useState([])

  const [state, setState] = useState({
    roleTitle: "",
    countryFlag: "",
    isWait: false,
    list: [],
    submitProcessing: false,
    updatedId: null,
  });

  const PERMISSIONS = ["ROLES", "EMPLOYEES", "SALARIES", "ATTENDANCE", "TEAMS", "TASKS"]

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_NODE_URL + "/users_roles/")
      .then((response) => {
        console.log(response);
        if (response.data.status == "1") {
          setState({
            ...state,
            list: response.data.details.roles,
          });
        }
      });
  }, []);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };


  const uploadData = async () => {
    try {
      if (state.roleTitle == "") {
        alert("Role title is required");
        return;
      }
      setState({
        ...state,
        submitProcessing: true,
      });
      let response = await axios.post(
        process.env.REACT_APP_NODE_URL + "/users_roles/",
        {
          role: state.roleTitle
        }
      );

      console.log(response);

      if (response.data.status == "1") {
        setState({
          ...state,
          list: [response.data.details.role, ...state.list],
          roleTitle: "",
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

  const setDelete = (role, index) => {
    let old = state.list
    old.splice(index, 1)

    axios
      .delete(process.env.REACT_APP_NODE_URL + "/users_roles/" + role._id)
      .then((response) => {
        alert(response.data.message)
        if (response.data.status == "1") {
          setState({
            ...state,
            list: old,
          });
        } else {
        }
      });


  };

  return (
    <>
      <div heading_title={"Add Roles"}>
        <div className="flex">
          <div className="row w-6/12 flex flex-row">
            <div className="shadow-lg w-10/12 mx-auto my-4 p-2">
              <div className="card-body">
                <label>Role Title</label>
                <div className="mb-3">
                  <input
                    type="email"
                    className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                    name="roleTitle"
                    placeholder="Enter Role Title"
                    value={state.roleTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn bg-gradient-primary w-100 ml-2 mt-4 text-white px-2 py-1 rounded mb-0"
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
                  <>Save</>
                )}
              </button>
              {state.updatedId != null && (
                <button
                  type="button"
                  className="btn bg-[red] w-100 ml-2 mt-4 text-white px-2 py-1 rounded mb-0"
                  onClick={null}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          <div className="mx-auto w-5/12 my-4 p-2">
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
                            Role Title
                          </th>
                          <th
                            scope="col"
                            class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                          >
                            Permissions
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
                        {state.list.map((role, index) => {
                          return (
                            <tr class="bg-gray-100 border-b">
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                {role.role}
                              </td>
                              <div className="btn_outerxx m-2">
                                <ButtonPrimary
                                  title={"Permissions"}
                                  onclick={() => {
                                    setModal(!Modal)
                                    setActiveRoleIndex(index)
                                    console.log({ p: role.permissions })
                                    setTempPermissions(role?.permissions)
                                  }}
                                />
                                {Modal && (
                                  <div className="modal_cover filter_model">
                                    <div className="modal_inner select-col-popup">
                                      <div className="header_modal">
                                        <ul>
                                          <li>
                                            {
                                              PERMISSIONS.map(permission => {
                                                if (tempPermissions?.includes(permission)) {
                                                  let per_index = tempPermissions.indexOf(permission)
                                                  return <div>
                                                    <input className="mr-2" type="checkbox" id={permission} onClick={() => {
                                                      if (tempPermissions?.includes(permission)) {
                                                        let per_index = tempPermissions.indexOf(permission)
                                                        let oldPermissions = JSON.parse(JSON.stringify(tempPermissions));
                                                        oldPermissions.splice(per_index, 1)
                                                        setTempPermissions(oldPermissions)
                                                      } else {
                                                        let oldPermissions = tempPermissions;
                                                        oldPermissions.push(permission)
                                                        setTempPermissions(oldPermissions)
                                                      }
                                                    }} defaultChecked />
                                                    <label id={permission}>{permission}</label>
                                                  </div>
                                                } else {
                                                  return <div>
                                                    <input className="mr-2" type="checkbox" id={permission} onClick={() => {
                                                      if (tempPermissions?.includes(permission)) {
                                                        let per_index = tempPermissions.indexOf(permission)
                                                        let oldPermissions = JSON.parse(JSON.stringify(tempPermissions));
                                                        oldPermissions.splice(per_index, 1)
                                                        setTempPermissions(oldPermissions)
                                                      } else {
                                                        let oldPermissions = tempPermissions;
                                                        oldPermissions.push(permission)
                                                        setTempPermissions(oldPermissions)
                                                      }
                                                    }} />
                                                    <label id={permission}>{permission}</label>
                                                  </div>
                                                }

                                              })
                                            }
                                          </li>
                                          <div className="flex justify-end">
                                            <span className="mx-1">
                                              <ButtonPrimary title={"Save"} onclick={async () => {
                                                let response = await axios
                                                  .patch(process.env.REACT_APP_NODE_URL + "/users_roles/update_permissions", {
                                                    roleId: state.list[activeRoleIndex]._id,   newPermissions: tempPermissions
                                                  })

                                                if (response.data.status == "1") {
                                                  let oldList = JSON.parse(JSON.stringify(state.list))
                                                  oldList[activeRoleIndex].permission = tempPermissions;
                                                  setState({
                                                    ...state,
                                                    list: oldList
                                                  })
                                                  setModal(false)
                                                }

                                                alert(response.data.message)
                                              }} />
                                            </span>
                                            <span className="mx-1">
                                              <ButtonPrimary theme="danger" title={"CANCLE"} onclick={() => {
                                                setModal(false)
                                                window.location.reload()
                                              }} />
                                            </span>
                                          </div>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <i
                                  class="fa-solid fa-trash cursor-pointer"
                                  onClick={() => setDelete(role, index)}
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

export default Roles;
