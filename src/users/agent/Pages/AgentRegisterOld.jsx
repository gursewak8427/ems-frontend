import axios from "axios";
import { useState } from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AgentAuthScreen from "../Screens/Authentication/AgentAuthScreen";

const AgentRegisterOld = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
        submitProcessing: false,
    })

    const RegisterNow = async () => {
        setState({
            ...state,
            submitProcessing: true,
        })
        const { email, password } = state;
        if (email == "" || password == "") return alert("All fields are required")
        const data = { email, password }
        const config = { 'content-type': 'application/json' }
        axios.post(process.env.REACT_APP_NODE_URL + "/agent/register", data).then(res => {
            // redirect
            window.location.href = "/agent/"
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
    return (
        <>
            <AgentAuthScreen>
                <>
                    <div className="row min-height-vh-100">
                        <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto mh-100vh">
                            <div className="card card-plain mt-8">
                                <div className="card-header pb-0 text-left bg-transparent">
                                    <h3 className="font-weight-bolder text-info text-gradient">Agent Register</h3>
                                    <p className="mb-0">Enter your email and password to register</p>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="mb-3">
                                            <input type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon" name="email" onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="mb-3">
                                            <input type="email" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" name="password" onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="button" onClick={RegisterNow} className="btn bg-gradient-info w-100 mt-4 mb-0">Register</button>
                                    </div>
                                </div>
                                <div className="card-footer text-center pt-0 px-lg-2 px-1">
                                    <p className="mb-4 text-sm mx-auto">
                                        Already have an account?
                                        <Link to="/student/login" className="text-info text-gradient font-weight-bold"> Login</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </AgentAuthScreen>
        </>
    )
}

export default AgentRegisterOld;