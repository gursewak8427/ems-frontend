import axios from "axios";
import { useState } from "react";
import { Link, Navigate, redirect, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import AgentDashboard from "../Screens/Dashboard/AgentDashboard";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { useEffect } from "react";

const AgentProgramsList = () => {
    const { query } = useParams()
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams();

    const [state, setState] = useState({
        agentToken: getToken("agent"),
        data: {},
        dataSchools: [],
        wait: true,
        currentPage: 1,
        noMore: false,
        buttonLoading: true,
        filterLoading: false,
        baseUrl: "",
        student: searchParams.get("student" || null),
        api_data: JSON.parse(query)
    })

    useEffect(() => {
        let api_data = JSON.parse(query)
        console.log({ api_data })

        setState({
            ...state,
            buttonLoading: true,

        })

        axios.post(`${process.env.REACT_APP_NODE_URL}/student/search`, api_data).then(response => {
            setState({
                ...state,
                data: { totalPrograms: response.data.details.totalPrograms, totalSchools: response.data.details.totalSchools },
                dataSchools: [...state.dataSchools, ...response.data.details.schools],
                wait: false,
                noMore: response.data.details.noMore,
                buttonLoading: false,
                currentPage: 1,
                baseUrl: response.data.details.baseUrl,
            })
            console.log(response)
        });


    }, [])



    return (
        <>
            <div className="agent">
                <div className="programs-list">
                    {
                        state.dataSchools.map(school => {
                            return (
                                <div className="program">
                                    <div className="top">
                                        <img src={state.baseUrl + school.school_meta_details.countryLogo} alt="" />
                                        <span className="uppercase">{school.country}</span>
                                    </div>
                                    <div className="body">
                                        <img src={state.baseUrl + school.school_meta_details.schoolLogo} alt="" />
                                        <span className="capitalize">{school.school_name}</span>
                                    </div>
                                    <div className="td flex justify-between">
                                        <td>Founded</td>
                                        <td>{school.founded}</td>
                                    </div>
                                    <div className="td flex justify-between">
                                        <td>Total Students</td>
                                        <td>{school.total_student}</td>
                                    </div>
                                    <div className="td flex justify-between">
                                        <td>Type</td>
                                        <td>{school.type}</td>
                                    </div>
                                    <button onClick={() => {
                                        if (state.student) {
                                            navigate(`/d/agent/findprograms/search/p/${school._id}?student=${state.student}`)
                                        } else {
                                            navigate(`/d/agent/findprograms/search/p/${school._id}?query=${query}`)
                                            // navigate(`/d/agent/findprograms/search/p/${school._id}?fname=${state.api_data.first_name}&lname=${state.api_data.last_name}&email=${state.api_data.email}&phone=${state.api_data.phone}`)
                                        }
                                    }}>
                                        Eligible Programs {school.school_programs.length}
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

export default AgentProgramsList;