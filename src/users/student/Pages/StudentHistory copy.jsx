import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import StudentDashboard from "../Screens/Dashboard/StudentDashboard";

const StudentHistory = (props) => {
    const navigate = useNavigate()

    const [state, setState] = useState({
        isWait: false,
        history: [],
        baseUrl: "",
    })


    useEffect(() => {
        // get enrolled list data from api using axios
        const config = { headers: { "Authorization": `Bearer ${getToken("student")}` } }
        axios.post(process.env.REACT_APP_NODE_URL + '/student/getHistory', {}, config)
            .then(res => {
                console.log(res)
                setState({
                    ...state,
                    history: res.data.details.history,
                    // baseUrl: res.data.details.baseUrl
                })
            }).catch(err => {
                console.log(err)
            })

    }, [])


    return (
        <>
            <StudentDashboard>
                <>
                    {/* table and row */}

                    <div className="card m-4">
                        <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive p-0 dashbord-table">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            {/* 
                                Logo, File Id, Country, School Name, Course, Application Fees, ESL, Fees Paid, In Take, Payment, Action,  */}
                                            <th className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left" scope="col">Sr.</th>
                                            <th className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left" scope="col">History</th>
                                            <th className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left" scope="col">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.history.map((history, index) => {
                                            return (
                                                <tr key={history._id}>
                                                    <td className="p-2 border-2">{index + 1}</td>
                                                    <td className="p-2 border-2">{history.text}</td>
                                                    <td className="p-2 border-2">{(new Date(history.created)).toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            </StudentDashboard>
        </>
    )
}

export default StudentHistory;