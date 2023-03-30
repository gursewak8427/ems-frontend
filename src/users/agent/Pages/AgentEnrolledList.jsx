import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { authenticate, getToken } from "../../../helper/auth";
import StudentPayment from "../../student/Pages/StudentPayment";
import AgentDashboard from "../Screens/Dashboard/AgentDashboard";
import AgentPayment from "./AgentPayment";

const AgentEnrolledList = () => {
    const navigate = useNavigate()
    const [state, setState] = useState({
        isWaiting: false,
        enrolledPrograms: [],
        agentToken: getToken("agent"),
        totalPages: 0,
        currentPage: 1,
        baseUrl: ""
    })

    useEffect(() => {
        getPaginationData(1);
    }, [])

    const getPaginationData = (page) => {
        const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }
        // let data = { currentPage: page }
        axios.get(process.env.REACT_APP_NODE_URL + "/agent/getAgentEnrolledList?type=PENDING", config).then(res => {
            console.log(res)
            setState({
                ...state,
                enrolledPrograms: res.data.details.enrolled_list,
                // totalPages: res.data.details.totalPages,
                // currentPage: res.data.details.currentPage,
                isWaiting: false,
                baseUrl: res.data.details.baseUrl
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


    // make array of months with small notiaions like Jan, Feb, etc
    const monthsArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return (
        <>
            <div>
                <>
                    <div className="row">
                        <div className="overflow-auto card shadow-lg m-4 col-12 px-0 pt-0 pb-2 agent-table border">
                            <table className="table-auto overflow-scroll w-full files-table">
                                <thead>
                                    <tr className="">
                                        <th className="p-2 text-left">File Id</th>
                                        <th className="p-2 text-left">School Logo</th>
                                        <th className="p-2 text-left">Student Name</th>
                                        <th className="p-2 text-left">Country</th>
                                        <th className="p-2 text-left">School/College</th>
                                        <th className="p-2 text-left">Program</th>
                                        <th className="p-2 text-left">Tution Fees</th>
                                        <th className="p-2 text-left">Duration</th>
                                        <th className="p-2 text-left">Created Date</th>
                                        <th className="p-2 text-left">Current Status</th>
                                        <th className="p-2 text-left">Processing Fees</th>
                                        <th className="p-2 text-left">Intake</th>
                                        <th className="p-2 text-left">Payment</th>
                                        <th className="p-2 text-left">Remarks</th>
                                        {/* <th className="p-2 align-middle text-center ">Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        state.enrolledPrograms.map((enrollDetails, index) => {
                                            return <tr>
                                                <td className="p-2 text-left">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.fileId}
                                                    </p>
                                                </td>
                                                <td
                                                    className="border-2 p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                                                    scope="col"
                                                >
                                                    <img
                                                        width={"100px"}
                                                        src={
                                                            state.baseUrl +
                                                            enrollDetails.school_details.school_meta_details
                                                                .schoolLogo
                                                        }
                                                        alt="logo"
                                                        className="img-fluid"
                                                    />
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.student_details.firstName} {enrollDetails.student_details.lastName}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.school_details.country}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.school_details.school_name}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.school_details.school_programs.program_name}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.school_details.school_programs.max_tution_fee}-{enrollDetails.school_details.school_programs.min_tution_fee_per_semester} {enrollDetails.school_details.school_programs.currency}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.school_details.school_programs.duration} Years
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {new Date(
                                                            parseInt(enrollDetails.createdAt)
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.enroll_status}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    <p className="text-xs font-weight-bold mb-0">
                                                        {enrollDetails.school_details.school_programs.application_fee} {enrollDetails.school_details.school_programs.currency}
                                                    </p>
                                                </td>
                                                <td>
                                                    {
                                                        enrollDetails.fees_status == "PENDING" ?
                                                            <select name="intakes" id={`selectedIntake_${index}`} className="p-2">
                                                                <option value="">--Select--</option>
                                                                {
                                                                    // USE map to show intakes under school_details.school_programs.intakes_data
                                                                    enrollDetails.school_details.school_programs.intakes_data.map(
                                                                        (intakes, IntakeIndex) => {
                                                                            return intakes.months.map(
                                                                                (month, monthIndex) => {
                                                                                    if (month == true) {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    IntakeIndex + "-" + monthIndex
                                                                                                }
                                                                                                value={
                                                                                                    intakes.year + "-" + monthIndex
                                                                                                }
                                                                                            >
                                                                                                {intakes.year +
                                                                                                    " " +
                                                                                                    monthsArr[monthIndex]}
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                        }
                                                                    )
                                                                }
                                                            </select> :
                                                            <>
                                                                {monthsArr[enrollDetails.intake.month - 1]}, {enrollDetails.intake.year}
                                                            </>
                                                    }
                                                </td>
                                                <td className="p-2 text-left capitalize">
                                                    {
                                                        enrollDetails.enroll_status == "FEES_PENDING" ?
                                                            <div className={`mx-auto flex justify-center payBtn payBtn_${index}`}>
                                                                <span className="first">
                                                                    <StudentPayment index={index} enrollId={enrollDetails._id} state={state} setState={setState} />
                                                                    {/* <ButtonPrimary title={"Pay"} onclick={_ => payNow(enrollDetails, index)} loading={false} /> */}
                                                                </span>
                                                                <span className="second">
                                                                    <StudentPayment index={index} enrollId={enrollDetails._id} state={state} setState={setState} />
                                                                    {/* <ButtonPrimary title={"Pay"} onclick={_ => payNow(enrollDetails, index)} loading={true} /> */}
                                                                </span>
                                                            </div> : enrollDetails.enroll_status == "PENDING" || enrollDetails.enroll_status == "UNDER_VERIFICATION" ? <span>
                                                                <ButtonPrimary title={"Pay"} onclick={() => alert("Your document's verification is pending!")} loading={false} />
                                                            </span> : "--"
                                                    }
                                                </td>
                                                <td className="p-2 text-left">
                                                    <ButtonPrimary title={"Remarks"} onclick={() => {
                                                        navigate("/d/agent/remarks/" + enrollDetails._id)
                                                    }} />
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
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
                    </div>
                </>
            </div>
        </>
    )
}

export default AgentEnrolledList;