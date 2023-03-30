import axios from "axios";
import { useState } from "react";
import { Link, Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AuthScreen from "../Screens/Authentication/StudentAuthScreen";
import Dashboard from "../Screens/Dashboard/StudentDashboard";

// firebase
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../../../firebase"
const provider = new GoogleAuthProvider();

const StudentForgot = (props) => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [state, setState] = useState({
        confirmpassword: "",
        newpassword: "",
        submitProcessing: false,
        email: ""
    })

    const LoginNow = async () => {
        if (state.newpassword != state.confirmpassword) {
            alert("Both passwords should be same")
            return;
        }
        if (state.newpassword == "" || state.confirmpassword == "") {
            alert("Both passwords are required")
            return;
        }
        setState({
            ...state,
            submitProcessing: true,
        })
        const { data, password } = state;
        const config = { headers: { "Authorization": `Bearer ${token}` } }
        const data2 = { newPassword: state.confirmpassword }
        axios.post(process.env.REACT_APP_NODE_URL + "/student/setnewpassword", data2, config).then(res => {
            console.log(res)
            if (res.data.status == "0") {
                alert(res.data.message)
                return;
            }
            alert(res.data.message)
            navigate("/d/")
            // authenticate with token
            // redirect
        }).catch(err => {
            console.log(err.response.data)
            alert(err.response.data.message)
        })
    }

    const handleInput = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }



    const SendEmail = async () => {
        if (state.email == "") {
            alert("Email is required")
            return;
        }
        setState({
            ...state,
            submitProcessing: true,
        })
        const data = { email: state.email }
        axios.post(process.env.REACT_APP_NODE_URL + "/student/forgotpassword", data).then(res => {
            console.log(res)
            if (res.data.status == "0") {
                alert(res.data.message)
                return;
            }
            alert(res.data.message)
            navigate("/d")
            // authenticate with token
            // redirect
        }).catch(err => {
            console.log(err.response.data)
            alert(err.response.data.message)
        })
    }


    return (
        <>
            <AuthScreen>
                {
                    !token ?

                        <div className="h-[100vh] flex flex-col justify-center">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-9/12">
                                    <h1 className="text-xl mb-2 font-black">Enter Email</h1>
                                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                                        <div className="space-y-6 bg-white px-4 py-2 sm:p-2">
                                            <div className="">
                                                <div className="col-span-3 sm:col-span-2">
                                                    <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                                        Email
                                                    </label>
                                                    <div className="mt-1 flex rounded-md shadow-sm">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={state.email}
                                                            onChange={handleInput}
                                                            id="company-website"
                                                            className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                                            placeholder="Enter your Email"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                            <button
                                                type="button"
                                                onClick={SendEmail}
                                                className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pt-2 px-lg-2 px-1">
                                <p className="mb-4 text-sm mx-auto">
                                    Want to login?
                                    <span onClick={() => navigate("/d/")} className="pl-2 text-info text-gradient font-bold cursor-pointer">Login</span>
                                </p>
                            </div>
                        </div> :
                        <div className="h-[100vh] flex flex-col justify-center">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-9/12">
                                    <h1 className="text-xl mb-2 font-black">Set New Password</h1>
                                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                                        <div className="space-y-6 bg-white px-4 py-2 sm:p-2">
                                            <div className="">
                                                <div className="col-span-3 sm:col-span-2">
                                                    <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                                        New Password
                                                    </label>
                                                    <div className="mt-1 flex rounded-md shadow-sm">
                                                        <input
                                                            type="password"
                                                            name="newpassword"
                                                            value={state.newpassword}
                                                            onChange={handleInput}
                                                            id="company-website"
                                                            className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                                            placeholder="Enter your email or phone"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                                    Confirm Password
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="password"
                                                        name="confirmpassword"
                                                        value={state.confirmpassword}
                                                        onChange={handleInput}
                                                        className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                                        placeholder="Enter your confirm password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                            <button
                                                type="button"
                                                onClick={LoginNow}
                                                className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pt-2 px-lg-2 px-1">
                                <p className="mb-4 text-sm mx-auto">
                                    Want to login?
                                    <span onClick={() => navigate("/d/")} className="pl-2 text-info text-gradient font-bold cursor-pointer">Login</span>
                                </p>
                            </div>
                        </div>
                }
            </AuthScreen>
        </>
    )
}

export default StudentForgot;