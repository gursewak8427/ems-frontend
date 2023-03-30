import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../../../helper/auth";
import Papa from "papaparse";
import Dashboard from "../Screens/Dashboard/Dashboard";
// import "./Addschoolname.css";
import { useDropzone } from 'react-dropzone'

const CreateCounselor = () => {
    const navigate = useNavigate()
    const [state, setState] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        username: ""
    })

    const handleChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const Create = () => {
        var data = { first_name: state.fname, last_name: state.lname, password: state.password, email: state.email, role: "COUNSELOR" }
        axios.post(process.env.REACT_APP_NODE_URL + "/admin/registercounselor", data).then(res => {
            // authenticate with token
            // redirect
            if(res.data.status == "0"){
                alert(res.data.message)
                return;
            }
            alert(res.data.message)
            navigate("/d/admin/listcounselor")
        }).catch(err => {
            console.log(err.response.data)
            // alert(err.response.data.message)
        })
    }

    return (
        <>
            <Dashboard heading_title={"Create Counselor"}>
                <>
                    <div className="row addCountryPage flex flex-row justify-start">
                        <div class="w-9/12 my-4 p-4">
                            <div class="card-body">

                                <div className="flex">
                                    <div class="m-3 w-6/12">
                                        <label>First Name</label>
                                        <input
                                            placeholder="First Name"
                                            type="text" class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                            name="fname"
                                            value={state.fname}
                                            onChange={handleChange} />
                                    </div>

                                    <div class="m-3 w-6/12">
                                        <label>Last Name</label>
                                        <input
                                            placeholder="Last Name"
                                            type="text" class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                            name="lname"
                                            value={state.lname}
                                            onChange={handleChange} />
                                    </div>
                                </div>

                                <div class="m-3">
                                    <label>Email</label>
                                    <input
                                        placeholder="Email"
                                        type="email" class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                        name="email"
                                        value={state.email}
                                        onChange={handleChange} />
                                </div>

                                <div class="m-3">
                                    <label>Password</label>
                                    <input
                                        placeholder="Enter Password"
                                        type="text" class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                        name="password"
                                        value={state.password}
                                        onChange={handleChange} />
                                </div>

                                <button type="button" class="btn bg-gradient-primary w-100 mt-4 text-white px-2 py-1 rounded m-3" onClick={() => Create()}>Create</button>
                            </div>
                        </div>
                    </div>
                </>
            </Dashboard>
        </>
    )
}

export default CreateCounselor;