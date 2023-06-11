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

const LeavesManagement = () => {
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
            .get(process.env.REACT_APP_NODE_URL + "/users/getAllLeaves?type=admin", config)
            .then((response) => {
                if (response.data.status == "1") {
                    setState({
                        ...state,
                        isWait: false,
                        list: response.data.details.list,
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
                <div className="flex flex-col p-3">
                    <div className="mx-auto w-full p-2">
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
                                                        User
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
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                                {leaveDetail?.userId?.fullname || ""}
                                                                {leaveDetail?.userId?.fullname && <br />}
                                                                {leaveDetail?.userId?.email || "--"}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {`${leaveDetail?.leave_type} (${leaveDetail?.leave_type == "EMERGENCY" ? `${leaveDetail?.userId?.total_leaves?.emergency || 0}/5` :
                                                                    leaveDetail?.leave_type == "MEDICAL" ? `${leaveDetail?.userId?.total_leaves?.medical || 0}/6` :
                                                                        leaveDetail?.leave_type == "EMERGENCY" && `${leaveDetail?.userId?.total_leaves?.casual || 0}/5`
                                                                    })`}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                                {`${leaveDetail?.leave_date.day}-${leaveDetail?.leave_date.month}-${leaveDetail?.leave_date.year}`}
                                                            </td>
                                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                                                                {<>
                                                                    <select
                                                                        value={leaveDetail?.status || "PENDING"}
                                                                        onChange={(e) => {
                                                                            const config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };

                                                                            let data = {
                                                                                leaveId: leaveDetail._id,
                                                                                userId: leaveDetail.userId._id,
                                                                                status: e.target.value,
                                                                            }

                                                                            axios
                                                                                .post(process.env.REACT_APP_NODE_URL + "/users/processLeave", data, config)
                                                                                .then((response) => {
                                                                                    if (response.data.status == "1") {
                                                                                        let oldList = [...state.list];
                                                                                        oldList[index] = response.data.details.leaveDetails
                                                                                        setState({
                                                                                            ...state,
                                                                                            list: [...oldList],
                                                                                        });
                                                                                    }
                                                                                });
                                                                        }}>
                                                                        <option value="PENDING">Pending</option>
                                                                        <option value="PAID_LEAVE">Approve as Paid Leave</option>
                                                                        <option value="APPROVED">Approved</option>
                                                                        <option value="REJECTED">Reject</option>
                                                                    </select>
                                                                </>}
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

export default LeavesManagement;
