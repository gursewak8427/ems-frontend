import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { authenticate, getToken } from "../../../helper/auth";
import AgentDashboard from "../Screens/Dashboard/AgentDashboard";

const AgentGetStudent = () => {
    const navigate = useNavigate()
    const [state, setState] = useState({
        isWaiting: false,
        students: [],
        agentToken: getToken("agent"),
        totalPages: 0,
        currentPage: 1,
    })

    useEffect(() => {
        getPaginationData(1);
    }, [])

    const getPaginationData = (page) => {
        const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }
        let data = { currentPage: page }
        axios.post(process.env.REACT_APP_NODE_URL + "/agent/getstudents", data, config).then(res => {
            console.log(res)
            setState({
                ...state,
                students: res.data.details.students,
                totalPages: res.data.details.totalPages,
                currentPage: res.data.details.currentPage,
                isWaiting: false,
            })
        }).catch(err => {
            console.log(err.response.data)
            alert(err.response.data.message)
        })
    }
    const range = (startAt, size) => {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    const findPrograms = (student) => {
        var api_data = {
            "highest_education": student.highestEducation,
            "exam": {
                "type": student.examType,
                "score": student.examType == "IELTS" ? [
                    parseFloat(student.writingScore),
                    parseFloat(student.readingScore),
                    parseFloat(student.speakingScore),
                    parseFloat(student.listeningScore)
                ] : student.examType == "PTE" ? parseFloat(student.pteScore) : student.examType == "TOFEL" ? parseFloat(student.tofelScore) : 0
            },
            "grade_score": parseFloat(student.gradeScore)
        }
        var jsondata = JSON.stringify(api_data);
        // await uploadQueryNow()
        navigate("/d/agent/findprograms/search/" + jsondata + "?student=" + student._id)
    }

    return (
        <>
            <div>
                <>
                    <div className="row">
                        <div className="row">
                            <div className="overflow-auto card shadow-lg m-4 col-12 px-0 pt-0 pb-2 agent-table border">
                                <table className="table-auto overflow-scroll w-full files-table">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-left">Id</th>
                                            <th className="p-2 text-left">Name</th>
                                            <th className="p-2 text-left">Email</th>
                                            <th className="p-2 text-left">Phone</th>
                                            <th className="p-2 text-left">Email Verification</th>
                                            {/* <th className="p-2 align-middle text-center ">Status</th> */}
                                            <th className="p-2 align-middle text-center ">Joining</th>
                                            <th className="p-2 text-secondary opacity-7" />
                                            <th className="p-2 text-secondary opacity-7" />
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            state.students.map((student, index) => {
                                                return <tr>
                                                    <td className="p-2 max-width">
                                                        <p className="text-xs font-weight-bold mb-0">{index + 1}</p>
                                                        {/* <p className="text-xs text-secondary mb-0"><b>ID:</b> {student._id}</p> */}
                                                    </td>
                                                    <td className="p-2 text-left">
                                                        <p className="text-xs font-weight-bold mb-0 capitalize">
                                                            {student.firstName || "--"}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 text-left">
                                                        <p className="text-xs font-weight-bold mb-0">
                                                            {student.email || "--"}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 text-left">
                                                        <p className="text-xs font-weight-bold mb-0">
                                                            {student.phone || "--"}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 text-left">
                                                        <p className="text-xs font-weight-bold mb-0">
                                                            {student.emailVerified == "UN_VERIFIED" ? "Not Verified" : "Verified" || "--"}
                                                        </p>
                                                    </td>
                                                    {/* <td className="p-2 text-center">
                                                                    <span className="badge badge-sm bg-gradient-success">Active</span>
                                                                </td> */}
                                                    <td className="align-middle text-center">
                                                        <span className="text-secondary text-xs font-weight-bold">23/04/18</span>
                                                    </td>
                                                    <td className="align-middle p-[10px]">
                                                        <ButtonPrimary
                                                            title={"Find Programs"}
                                                            onclick={() => findPrograms(student)}
                                                        />
                                                    </td>
                                                    <td className="align-middle p-[10px]">
                                                        <ButtonPrimary
                                                            title={"Documents"}
                                                            onclick={() => navigate("/d/agent/documents/" + student._id)}
                                                        />
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer pb-0">
                            {/* pagination is here */}
                            <div className="pagination">
                                <div className="pages">
                                    <ReactPaginate
                                        breakLabel="..."
                                        nextLabel="next"
                                        onPageChange={(event) => {
                                            getPaginationData(event.selected + 1)
                                        }}
                                        pageRangeDisplayed={2}
                                        pageCount={state.totalPages}
                                        previousLabel="prev"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </div >
        </>
    )
}

export default AgentGetStudent;