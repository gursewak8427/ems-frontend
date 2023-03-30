import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const AdminAgentProfile = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        isWaiting: true,
        agentProfile: {},
        adminToken: getToken("admin"),
        reason: "",
        reasonType: -1,
        remarkpopupActive: false,
        remarkpopupActiveDocType: false,
        baseUrl: ""
    })

    const toggleRemarkPopup = (type) => {
        setState({
            ...state,
            remarkpopupActive: !state.remarkpopupActive,
            remarkpopupActiveDocType: type
        })
    }

    const [tab, setTab] = useState(1)

    const agentId = searchParams.get("id")
    useEffect(() => {
        if (agentId) {
            const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
            axios.get(process.env.REACT_APP_NODE_URL + "/agent/getprofile?id=" + agentId, config).then(res => {
                console.log(res.data.details)
                setState({
                    ...state,
                    agentProfile: res.data.details.agent,
                    isWaiting: false,
                    baseUrl: res.data.details.baseUrl
                })
            });
        } else {
            setState({
                ...state,
                isWaiting: false,
            })
        }
    }, [])

    // const AsideBarAgentDetails = () => <></>
    // const AsideBarAgentDetails = () =>

    const RemarkPopup = () => {

        const changeReasonType = (e) => {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }

        const submitNow = () => {
            const remarkReason = document.getElementById("remarkReason").value

            const data = { [state.remarkpopupActiveDocType]: "DECLINED", reason: state.reasonType == "Other" ? remarkReason : state.reasonType, document: state.remarkpopupActiveDocType }
            const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
            axios.post(process.env.REACT_APP_NODE_URL + "/agent/update?id=" + agentId, data, config).then(res => {
                if (res.data.status == "1") {
                    setState({
                        ...state,
                        agentProfile: {
                            ...state.agentProfile,
                            [state.remarkpopupActiveDocType]: "DECLINED"
                        },
                        remarkpopupActive: false,
                    })
                }
            });
        }
        return (
            <>
                <div className={`remarkpopup ${state.remarkpopupActive && "active"}`}>
                    <div className="w-full">
                        <h1>
                            <span>
                                Select Reason
                            </span>
                            <div className="close" onClick={toggleRemarkPopup}>
                                <svg className="mr-2" style={{ width: "25px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg>
                            </div>
                        </h1>
                        <ul>
                            <div className="form-group">
                                {
                                    state.reasonType == "Not Visible" ?
                                        <input type="radio" name="reasonType" id="1" value={"Not Visible"} onChange={changeReasonType} checked /> :
                                        <input type="radio" name="reasonType" id="1" value={"Not Visible"} onChange={changeReasonType} />

                                }
                                <label htmlFor="1">Not Visible </label>
                            </div>
                            <div className="form-group">
                                {
                                    state.reasonType == "Invalid Document" ?
                                        <input type="radio" name="reasonType" id="2" value={"Invalid Document"} onChange={changeReasonType} checked /> :
                                        <input type="radio" name="reasonType" id="2" value={"Invalid Document"} onChange={changeReasonType} />

                                }
                                <label htmlFor="2">Invalid Document</label>
                            </div>
                            <div className="form-group">
                                {
                                    state.reasonType == "Other" ?
                                        <input type="radio" name="reasonType" id="3" value={"Other"} onChange={changeReasonType} checked /> :
                                        <input type="radio" name="reasonType" id="3" value={"Other"} onChange={changeReasonType} />
                                }
                                <label htmlFor="3">Other</label>
                            </div>
                            <div className={`form-group ${state.reasonType == "Other" ? "" : "hidden"}`}>
                                <input type="text" placeholder="Type Reason" className="form-control border-1 border-grey px-2 py-2 mb-3" id="remarkReason" />
                            </div>
                            <div>
                                <button className="py-[4px] px-[12px] rounded-full text-black submitRemarkBtn" onClick={submitNow}>Submit</button>
                            </div>
                        </ul>
                    </div>
                </div>
            </>
        )
    }

    const approveDocStatus = (doc) => {
        if (window.confirm("Are you sure ?")) {
            // now update
            const data = { [doc]: "APPROVED", document: doc }
            const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
            axios.post(process.env.REACT_APP_NODE_URL + "/agent/update?id=" + agentId, data, config).then(res => {
                if (res.data.status == "1") {
                    setState({
                        ...state,
                        agentProfile: {
                            ...state.agentProfile,
                            [doc]: "APPROVED"
                        }
                    })
                }
                // setState({
                //     ...state,
                //     agentProfile: res.data.details.agent,
                //     isWaiting: false,
                // })
            });
        }
    }

    if (state.isWaiting) return "Waiting..."
    return (
        <>
            <div heading_title={"Agent Profile"}>
                <>
                    <div className={`agentDetailsAsideBar active`}>
                        {/* <h1>
                            Agent Details
                            <button onClick={() => {
                                setState({ ...state, activeAgentDetails: null })
                                navigate("/d/admin/manage?status=unapproved")
                            }}>Close</button>
                        </h1> */}
                        <div className="">
                            <table className="table-responsive">
                                <div className="tabs">
                                    <h2 className={`${tab == 1 && "active"}`} onClick={() => setTab(1)}>Basic</h2>
                                    <h2 className={`${tab == 2 && "active"}`} onClick={() => setTab(2)}>Documents</h2>
                                    <h2 className={`${tab == 3 && "active"}`} onClick={() => setTab(3)}>Additional Details</h2>
                                </div>
                                <div className={`tabDetail ${tab == 1 && "active"}`}>
                                    <tr className="py-0">
                                        <div className="p-2 flex flex-col">
                                            <th>Username :</th>
                                            <td className="capitalize">{state.agentProfile?.username || ""}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Email :</th>
                                            <td className="lowercase">{state.agentProfile?.email || ""}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>First Name :</th>
                                            <td>{state.agentProfile?.first_name}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Last Name :</th>
                                            <td>{state.agentProfile?.last_name}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Phone :</th>
                                            <td>{state.agentProfile?.phone || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th></th>
                                            <td></td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Street :</th>
                                            <td>{state.agentProfile?.street || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>City :</th>
                                            <td>{state.agentProfile?.city || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>State :</th>
                                            <td>{state.agentProfile?.state || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Country :</th>
                                            <td>{state.agentProfile?.country || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Postal Code :</th>
                                            <td>{state.agentProfile?.postal_code || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th></th>
                                            <td></td>
                                        </div>
                                    </tr>
                                </div>
                                <div className={`tabDetail docs ${tab == 2 && "active"}`}>
                                    <table className="table-fixed w-full p-2">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* <tr>
                                                <td className="flex items-center">
                                                    <img src="" alt="" />
                                                    Profile Photo
                                                </td>
                                                <td>
                                                    <button className="approve">Approve</button>
                                                    <button className="decline">Decline</button>
                                                </td>
                                            </tr> */}
                                            <tr className="px-2 docRow">
                                                <td className="flex items-center">
                                                    <svg className="mr-2" style={{ width: "25px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                                    Company Logo
                                                </td>
                                                {
                                                    state.agentProfile?.company_logo ? <>

                                                        <td className="flex items-center justify-end">
                                                            {
                                                                state.agentProfile?.company_logo_status != "PENDING" ? <>
                                                                    {
                                                                        state.agentProfile?.company_logo_status == "APPROVED" ?
                                                                            <div className="approved_status">Approved</div> :
                                                                            <div className="declined_status">Declined</div>
                                                                    }
                                                                </> :
                                                                    <>
                                                                        <button className="approve" onClick={() => approveDocStatus("company_logo_status")}>Approve</button>
                                                                        <button className="decline" onClick={() => toggleRemarkPopup("company_logo_status")}>Decline</button>
                                                                    </>
                                                            }
                                                        </td>

                                                        <span className="flex items-center justify-end downloadSvg" title="Download">
                                                            <a href={state.baseUrl + "/uploads/agent/" + state.agentProfile?.company_logo} download="companylogo" target={"_blank"}>
                                                                <svg style={{ width: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                            </a>
                                                        </span>

                                                    </> : <><td></td><td><div className="declined_status text-right">Pending</div></td> </>
                                                }


                                            </tr>
                                            <tr className="px-2 docRow">
                                                <td className="flex items-center">
                                                    <svg className="mr-2" style={{ width: "25px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.3-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z" /></svg>
                                                    Business Certificate
                                                </td>
                                                {
                                                    state.agentProfile?.business_certificate ? <>
                                                        <td className="flex items-center justify-end">
                                                            {
                                                                state.agentProfile?.business_certificate_status != "PENDING" ? <>
                                                                    {
                                                                        state.agentProfile?.business_certificate_status == "APPROVED" ?
                                                                            <div className="approved_status">Approved</div> :
                                                                            <div className="declined_status">Declined</div>
                                                                    }
                                                                </> :
                                                                    <>
                                                                        <button className="approve" onClick={() => approveDocStatus("business_certificate_status")}>Approve</button>
                                                                        <button className="decline" onClick={() => toggleRemarkPopup("business_certificate_status")}>Decline</button>
                                                                    </>
                                                            }
                                                        </td>
                                                        <span className="flex items-center justify-end downloadSvg" title="Download">
                                                            <a target={"_blank"} href={state.baseUrl + "/uploads/agent/" + state.agentProfile?.business_certificate} download="business_certificate">
                                                                <svg style={{ width: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                            </a>
                                                        </span>
                                                    </> : <><td></td><td><div className="declined_status text-right">Pending</div></td> </>
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* <div className="profile-image">
                                        <label htmlFor="">Profile Image</label>
                                        {
                                            state.agentProfile?.profile_image ?
                                                <img src={`http://localhost:3006/uploads/agent/${state.agentProfile?.profile_image}`} alt="" /> :
                                                <>Pending</>
                                        }
                                    </div>
                                    <div className="company-logo">
                                        <label htmlFor="">Company Logo</label>
                                        {
                                            state.agentProfile?.company_logo ?
                                                <img src={`http://localhost:3006/uploads/agent/${state.agentProfile?.company_logo}`} alt="" /> :
                                                <>Pending</>
                                        }
                                    </div>
                                    <div className="certificate-pdf">
                                        <label htmlFor="">Business Certificate</label>
                                        {
                                            state.agentProfile?.business_certificate ?
                                                <>
                                                    <p className="text-center text-sm">{state.agentProfile?.business_certificate}</p>
                                                    <span onClick={() => window.open(`http://localhost:3006/uploads/agent/${state.agentProfile?.business_certificate}`, "_blank")}>Open</span>
                                                </> :
                                                <>Pending</>
                                        }

                                    </div> */}
                                </div>
                                <div className={`tabDetail ${tab == 3 && "active"}`}>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Principal Country of Business :</th>
                                            <td>{state.agentProfile?.principal_country_of_business || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Company Name :</th>
                                            <td>{state.agentProfile?.company_name || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Cellphone :</th>
                                            <td>{state.agentProfile?.cellphone || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Facebook Page :</th>
                                            <td>{state.agentProfile?.facebook_page_name || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Skype Id :</th>
                                            <td>{state.agentProfile?.skype_ID || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Whatsapp Id :</th>
                                            <td>{state.agentProfile?.whatsapp_ID || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Instagram Handle :</th>
                                            <td>{state.agentProfile?.instagram_handle || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Twitter Handle :</th>
                                            <td>{state.agentProfile?.twitter_handle || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Linkedin :</th>
                                            <td>{state.agentProfile?.linkedin_URL || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">When did you begin recruiting students?</li>
                                        <li className="answer">{state.agentProfile?.begin_recruiting_students || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">What services do you provide to your clients?</li>
                                        <li className="answer">{state.agentProfile?.linkedin_URL || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">Canadian Schools Represented</li>
                                        <li className="answer">{state.agentProfile?.canadaian_schools_represented || "No"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">American Schools Represented</li>
                                        <li className="answer">{state.agentProfile?.american_schools_represented || "No"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">Represents Other Countries</li>
                                        <li className="answer">{state.agentProfile?.represents_other_countries || "No"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">What institutions are you representing?</li>
                                        <li className="answer">{state.agentProfile?.institutions_representing || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">What educational associations or groups belong to?</li>
                                        <li className="answer">{state.agentProfile?.belongs_to || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">Where do you recruit from?</li>
                                        <li className="answer">{state.agentProfile?.recruit_from || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">Approximately how many students do you send abroad per year?</li>
                                        <li className="answer">{state.agentProfile?.student_to_abroad || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">What type of marketing methods do you undertake?</li>
                                        <li className="answer">{state.agentProfile?.marketing_methods.join(",") || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">Average Service Fee</li>
                                        <li className="answer">{state.agentProfile?.average_fee || "---"}</li>
                                    </tr>
                                    <tr className="question_row">
                                        <li className="question">Please provide an estimate of the number of students you will refer to Learn Global.</li>
                                        <li className="answer">{state.agentProfile?.students_refer_to_learn_global || "---"}</li>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Phone</th>
                                            <td>{state.agentProfile?.reference_phone || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Website</th>
                                            <td className="lowercase">{state.agentProfile?.reference_website || "---"}</td>
                                        </div>
                                    </tr>
                                </div>

                            </table>
                        </div>
                    </div>
                </>
            </div >
            <RemarkPopup />
        </>
    )
}

export default AdminAgentProfile;