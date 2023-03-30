import axios from "axios";
import { useState } from "react";
import { Link, Navigate, redirect, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import AgentDashboard from "../Screens/Dashboard/AgentDashboard";
import { BigLoading } from "../../../common/BigLoading";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AgentSubProgramsList = () => {
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)
    const { schoolId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams();

    const [state, setState] = useState({
        agentToken: getToken("agent"),
        data: {},
        dataSchools: [],
        wait: true,
        currentPage: 1,
        noMore: false,
        buttonLoading: false,
        filterLoading: false,
        baseUrl: "",
        student: searchParams.get("student" || null),
        query: searchParams.get("query" || null),
    })

    useEffect(() => {
        let api_data = { schoolId, currentPage: 1 }
        console.log({ api_data })

        setState({
            ...state,
            buttonLoading: true,
        })

        axios.post(`${process.env.REACT_APP_NODE_URL}/admin/getprograms`, api_data).then(response => {
            setState({
                ...state,
                data: { totalPrograms: response.data.details.totalPrograms, totalSchools: response.data.details.totalSchools },
                dataSchools: [...state.dataSchools, ...response.data.details.totalData],
                wait: false,
                noMore: response.data.details.noMore,
                buttonLoading: false,
                currentPage: 1,
                baseUrl: response.data.details.baseUrl,
            })
            console.log(response)
        });


    }, [])


    const enrollNow = (sId, pId) => {
        setState({
            ...state,
            buttonLoading: true,
        })
        if (state.student) {

            const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }
            let data = {
                "student_id": state.student,
                "school_id": sId,
                "program_id": pId
            }
            axios.post(process.env.REACT_APP_NODE_URL + "/student/enroll", data, config).then(res => {
                console.log({ res })
                if (res.data.status == "1") {
                    navigate("/d/agent/enrolled-list")
                    toast(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
                setState({
                    ...state,
                    buttonLoading: false,
                })
            }).catch(err => {
                console.log(err.response.data)
                alert(err.response.data.message)
                setState({
                    ...state,
                    buttonLoading: false,
                })
            })

        } else {
            let api_data = JSON.parse(state.query);

            const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }
            let data = {
                "email": api_data.email,
                "firstName": api_data.first_name,
                "lastName": api_data.last_name,
                "phone": api_data.phone,
                "highestEducation": api_data.highest_education,
                "gradeScore": api_data.grade_score,
                "examType": api_data.exam.type,
                "pteScore": api_data.exam.type == "PTE" ? api_data.exam.score : null,
                "tofelScore": api_data.exam.type == "TOFEL" ? api_data.exam.score : null,
                "readingScore": api_data.exam.type == "IELTS" ? api_data.exam.score[1] : null,
                "listeningScore": api_data.exam.type == "IELTS" ? api_data.exam.score[3] : null,
                "writingScore": api_data.exam.type == "IELTS" ? api_data.exam.score[0] : null,
                "speakingScore": api_data.exam.type == "IELTS" ? api_data.exam.score[2] : null,
                "fromEnroll": true,
                "school_id": sId,
                "program_id": pId
            }
            axios.post(process.env.REACT_APP_NODE_URL + "/agent/register_enroll", data, config).then(res => {
                console.log({ res })
                if (res.data.status == "1") {
                    navigate("/d/agent/enrolled-list")
                    toast(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
                setState({
                    ...state,
                    buttonLoading: false,
                })
            }).catch(err => {
                console.log(err.response.data)
                alert("error")
                setState({
                    ...state,
                    buttonLoading: false,
                })
            })


        }

    }

    return (
        <>
            <div className="agent">
                {
                    state.buttonLoading && <BigLoading />
                }
                <div className="programs-list">
                    {
                        state.dataSchools.length == 0 ? null :
                            state.dataSchools[0].school_programs.map(program => {
                                return (
                                    <div className="program p-2">
                                        {/* <div className="top"> */}
                                        {/* <img src={state.baseUrl + program} alt="" /> */}
                                        {/* <span className="uppercase">{program.program_name}</span> */}
                                        {/* </div> */}
                                        <div className="body">
                                            {/* <img src={state.baseUrl + state.dataSchools[0].school_meta_details.schoolLogo} alt="" /> */}
                                            <span className="capitalize text-center">{program.program_name}</span>
                                            <p className="max-two-line text-center text-[12px]">{program.description}</p>
                                        </div>
                                        <div className="td flex justify-between text-center">
                                            <td>Certificate</td>
                                            <td>{program.credentials}</td>
                                        </div>
                                        <div className="td flex justify-between text-center">
                                            <td>Duration</td>
                                            <td>{
                                                `${program.duration} Years ${program.duration_sem_per_year ? "(" + program.duration_sem_per_year + " Sem)" : ""}`
                                            }</td>
                                        </div>
                                        {/* <div className="td flex justify-between text-center">
                                            <td>Total Students</td>
                                            <td>{"total_student"}</td>
                                        </div>
                                        <div className="td flex justify-between">
                                            <td>Type</td>
                                            <td>{"type"}</td>
                                        </div> */}
                                        <button onClick={() => enrollNow(state.dataSchools[0]._id, program.program_id)}>
                                            Enroll
                                        </button>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </>
    )
}

export default AgentSubProgramsList;