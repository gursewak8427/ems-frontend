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

const LeaveUser = () => {
    const [state, setState] = useState({
        leaveDescription: "",
        leaveType: "",
        leaveDate: "",
        teamsList: [],
        leaveTypesList: ["MEDICAL", "EMERGENCY", "CASUAL"],
        selectedTeamId: "",
        selectedTeamIndex: -1,
        selectedTeamLeaderIds: [],

        isWait: true,
        submitProcessing: false,
        list: [],
        totalLeaves: [],
    });

    useEffect(() => {
        const config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
        axios
            .get(process.env.REACT_APP_NODE_URL + "/users/getAllLeaves", config)
            .then((response) => {
                if (response.data.status == "1") {
                    setState({
                        ...state,
                        isWait: false,
                        list: response.data.details.list,
                        totalLeaves: response.data.details.total_leaves,
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
            if (state.leaveDescription == "") {
                alert("Please Write Leave Description");
                return;
            }
            if (state.leaveType == "") {
                alert("Please select leave type");
                return;
            }
            setState({
                ...state,
                submitProcessing: true,
            });

            let dateArr = state.leaveDate.split("-");
            let apiData = {
                leave_description: state.leaveDescription,
                leave_type: state.leaveType,
                leave_date: {
                    year: dateArr[0],
                    month: dateArr[1],
                    day: dateArr[2],
                }
            }

            const config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
            let response = await axios.post(
                process.env.REACT_APP_NODE_URL + "/users/applyLeave",
                apiData,
                config
            );

            alert(response.data.message);

            if (response.data.status == "1") {
                setState({
                    ...state,
                    list: [response.data.details.leaveDetails, ...state.list],
                    leaveDescription: "",
                    leaveType: "",
                    leaveDate: "",
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
                <div className="top p-3 m-2 bg-lightgrey text-xl flex">
                    <div className="left w-6/12">
                        <table>
                            <tr className="m-2">
                                <td className="pr-2">Emergency Leaves </td>
                                <td><b><big className="text-red-600">{state.totalLeaves.emergency}</big>/<small>5</small></b></td>
                            </tr>
                            <tr className="m-2">
                                <td>
                                    Medical Leaves
                                </td>
                                <td>
                                    <b><big className="text-red-600">{state.totalLeaves.medical}</big>/<small>6</small></b>
                                </td>
                            </tr>
                            <tr className="m-2">
                                <td>
                                    Casual Leaves
                                </td>
                                <td>
                                    <b><big className="text-red-600">{state.totalLeaves.casual}</big>/<small>5</small></b>
                                </td>
                            </tr>
                            <tr className="m-2">
                                <td>
                                    Paid leaves
                                </td>
                                <td>
                                    <b>0</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="right w-6/12">
                        <tr className="m-2">
                            <td>Month</td>
                            <td><b>24 June, 2023</b></td>
                        </tr>
                        <tr className="m-2">
                            <td className="pr-2">Total Leaves</td>
                            <td><b className="text-blue-600">12</b></td>
                        </tr>
                    </div>
                </div>
                <div className="flex flex-col p-3">
                    <div className="row w-full flex flex-row">
                        <div className="shadow-lg w-full mx-auto my-4 p-2">
                            <div className="card-body">
                                <label>Leave Description</label>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="block flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                        name="leaveDescription"
                                        placeholder="Enter Task Description"
                                        value={state.taskDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        className="block flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                        name="leaveDate"
                                        onChange={handleChange}
                                    />
                                </div>
                                <label>Leave Type</label>
                                <div>
                                    <select name="leaveType" onChange={handleChange}
                                        className="block flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm">
                                        <option value="" selected>Select</option>
                                        {
                                            state.leaveTypesList.map((leaveType, index) => {
                                                return (
                                                    <option value={leaveType}>
                                                        {leaveType}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-lg btn bg-gradient-primary w-100 mt-4 text-white px-4 py-2 rounded mb-0"
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
                                ) : (
                                    <>Apply</>
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
                                                        Leave Description
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                                                    >
                                                        Leave Type
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                                                    >
                                                        Date
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
                                                        Apply Date
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-left font-bold"
                                                    >
                                                        Response Date
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
                                                {state.list.map((leaveDetail, index) => {
                                                    return (
                                                        <tr class="bg-gray-100 border-b">
                                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {index + 1}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {leaveDetail?.leave_description || "--"}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {leaveDetail?.leave_type || "--"}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                                {`${leaveDetail?.leave_date.day}-${leaveDetail?.leave_date.month}-${leaveDetail?.leave_date.year}`}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {leaveDetail?.status || "PENDING"}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {(new Date(leaveDetail?.createdAt)).toLocaleString()}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {leaveDetail?.response_date || "--"}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                                <i
                                                                    class="fa-solid fa-trash cursor-pointer text-red-600"
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

export default LeaveUser;
