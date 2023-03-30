import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
    Link,
    Navigate,
    redirect,
    useNavigate,
    useSearchParams
} from "react-router-dom";
import { toast } from "react-toastify";
import { BigLoading } from "../../../common/BigLoading";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const StudentDocumentsPopup = ({ sId, fId, setModalCode }) => {
    const [checkbox, setCheckBox] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        isWaiting: true,
        studentProfile: {},
        enrolledList: [],
        adminToken: getToken("admin"),
        reason: "",
        reasonType: -1,
        remarkpopupActive: false,
        remarkpopupActiveDocType: false,
        baseUrl: "",
        popup: false,
        remark: "",
        remarksList: [],
        profileApproveLoading: false,
        fileId: null,
        approveFileLoading: false,
        bigLoading: false,
    });

    const toggleRemarkPopup = (type) => {
        setState({
            ...state,
            remarkpopupActive: !state.remarkpopupActive,
            remarkpopupActiveDocType: type
        });
    };

    const [tab, setTab] = useState(searchParams.get("tab") == "documents" ? 2 : 2);


    useEffect(() => {
        if (sId) {
            const config = {
                headers: {
                    Authorization: `Bearer ${state.adminToken
                        }`
                }
            };
            axios.get(process.env.REACT_APP_NODE_URL + "/student?id=" + sId, config).then((res) => {
                console.log(res.data.details);
                axios.post(process.env.REACT_APP_NODE_URL + "/student/getRemarks?id=" + sId, {}, config).then((remarksResponse) => {
                    setState({
                        ...state,
                        studentProfile: res.data.details.student,
                        enrolledList: res.data.details.enrolledList,
                        isWaiting: false,
                        baseUrl: res.data.details.baseUrl,
                        remarksList: remarksResponse.data.details.remarks
                    });
                });
            });
        } else {
            setState({
                ...state,
                isWaiting: false
            });
        }
    }, []);

    // const AsideBarAgentDetails = () => <></>
    // const AsideBarAgentDetails = () =>

    const RemarkPopup = () => {
        const changeReasonType = (e) => {
            setState({
                ...state,
                [e.target.name]: e.target.value
            });
        };

        const submitNow = () => {
            setState({
                ...state,
                bigLoading: true,
            })
            const remarkReason = document.getElementById("remarkReason").value;

            let oldDocs = state.studentProfile.documents;
            oldDocs[parseInt(state.remarkpopupActiveDocType)].document_status = "UN_APPROVED";

            const data = {
                documents: oldDocs,
                reason: state.reasonType == "Other" ? remarkReason : state.reasonType,
                doc_title: oldDocs[parseInt(state.remarkpopupActiveDocType)].document_title
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${state.adminToken
                        }`
                }
            };
            axios.patch(process.env.REACT_APP_NODE_URL + "/student?id=" + sId, data, config).then((res) => {
                if (res.data.status == "1") {
                    setState({
                        ...state,
                        studentProfile: {
                            ...state.studentProfile,
                            documents: oldDocs
                        },
                        remarkpopupActive: false,
                        remarkpopupActiveDocType: false,
                        bigLoading: false,
                    });
                }
                // setState({
                //     ...state,
                //     agentProfile: res.data.details.agent,
                //     isWaiting: false,
                // })
            });
        };

        return (
            <>
                {
                    state.bigLoading && <BigLoading />
                }
                <div className={
                    `remarkpopup ${state.remarkpopupActive && "active"
                    }`
                }>
                    <div className="w-full">
                        <h1>
                            <span>Select Reason</span>
                            <div className="close"
                                onClick={toggleRemarkPopup}>
                                <svg className="mr-2"
                                    style={
                                        { width: "25px" }
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512">
                                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                                </svg>
                            </div>
                        </h1>
                        <ul>
                            <div className="form-group">
                                {
                                    state.reasonType == "Not Visible" ? (
                                        <input type="radio" name="reasonType" id="1"
                                            value={"Not Visible"}
                                            onChange={changeReasonType}
                                            checked />
                                    ) : (
                                        <input type="radio" name="reasonType" id="1"
                                            value={"Not Visible"}
                                            onChange={changeReasonType} />
                                    )
                                }
                                <label htmlFor="1">Not Visible
                                </label>
                            </div>
                            <div className="form-group">
                                {
                                    state.reasonType == "Invalid Document" ? (
                                        <input type="radio" name="reasonType" id="2"
                                            value={"Invalid Document"}
                                            onChange={changeReasonType}
                                            checked />
                                    ) : (
                                        <input type="radio" name="reasonType" id="2"
                                            value={"Invalid Document"}
                                            onChange={changeReasonType} />
                                    )
                                }
                                <label htmlFor="2">Invalid Document</label>
                            </div>
                            <div className="form-group">
                                {
                                    state.reasonType == "Other" ? (
                                        <input type="radio" name="reasonType" id="3"
                                            value={"Other"}
                                            onChange={changeReasonType}
                                            checked />
                                    ) : (
                                        <input type="radio" name="reasonType" id="3"
                                            value={"Other"}
                                            onChange={changeReasonType} />
                                    )
                                }
                                <label htmlFor="3">Other</label>
                            </div>
                            <div className={
                                `form-group ${state.reasonType == "Other" ? "" : "hidden"
                                }`
                            }>
                                <input type="text" placeholder="Type Reason" className="form-control border-1 border-grey px-2 py-2 mb-3" id="remarkReason" />
                            </div>
                            <div>
                                <button className="py-[4px] px-[12px] rounded-full text-black submitRemarkBtn"
                                    onClick={submitNow}>
                                    Submit
                                </button>
                            </div>
                        </ul>
                    </div>
                </div>
            </>
        );
    };

    const approveDocStatus = (index) => {
        if (window.confirm("Are you sure ?")) { // now update
            setState({
                ...state,
                bigLoading: true,
            })
            const config = {
                headers: {
                    Authorization: `Bearer ${state.adminToken
                        }`
                }
            };
            let oldDocs = state.studentProfile.documents;
            oldDocs[index].document_status = "APPROVED";

            const data = {
                documents: oldDocs,
                doc_title: oldDocs[index].document_title
            };

            axios.patch(process.env.REACT_APP_NODE_URL + "/student?id=" + sId, data, config).then((res) => {
                if (res.data.status == "1") {
                    toast(res.data.message);
                    setState({
                        ...state,
                        bigLoading: false,
                        studentProfile: {
                            ...state.studentProfile,
                            documents: oldDocs
                        },
                    });
                    return;
                }
                setState({
                    ...state,
                    bigLoading: false,
                })
                toast.error(res.data.message);

                // setState({
                //     ...state,
                //     agentProfile: res.data.details.agent,
                //     isWaiting: false,
                // })
            });
        }
    };


    const approveFileNow = () => {
        if(!checkbox){
            // close popup
            setModalCode(false)
            return;
        }
        if (fId == null) {
            toast.error("File Id not received")
            return;
        }

        if (window.confirm("Are you sure ?")) { // now update
            setState({
                ...state,
                approveFileLoading: true,
            });

            const config = {
                headers: {
                    Authorization: `Bearer ${state.adminToken
                        }`
                }
            };
            const data = {
                fileId: fId,
                status: "IN_PROCESSING"
            };

            axios.patch(process.env.REACT_APP_NODE_URL + "/admin/updateEnrollStatus", data, config).then((res) => {

                setState({
                    ...state,
                    approveFileLoading: false,
                });
                if (res.data.status == "1") {
                    toast(res.data.message);
                    navigate("/d/admin/fees-pending")
                } else {
                    toast.error(res.data.message);
                }
                // setState({
                //     ...state,
                //     agentProfile: res.data.details.agent,
                //     isWaiting: false,
                // })
            }).catch(err => {
                console.log({ updateEnrollStatus_Error: err });
                toast.error("Something went wrong");
                setState({
                    ...state,
                    approveFileLoading: false,
                });
            });
        }
    };

    if (state.isWaiting)
        return "Waiting...";



    const unApproveProfile = () => {
        setState({
            ...state,
            profileApproveLoading: true
        });
        if (!window.confirm("Are you sure ?"))
            return;



        const config = {
            headers: {
                Authorization: `Bearer ${state.adminToken
                    }`
            }
        };
        const data = {};
        axios.post(process.env.REACT_APP_NODE_URL + "/student/approveProfile?id=" + sId, data, config).then((res) => {
            if (res.data.status == "1") {
                alert(res.data.message);
                setState({
                    ...state,
                    studentProfile: {
                        ...state.studentProfile,
                        status: "IN_PROCESS"
                    },
                    profileApproveLoading: false
                });
                return;
            }
            alert(res.data.message);

            // setState({
            //    ...state,
            //     agentProfile: res.data.details.agent,
            //     isWaiting: false,
            // })
        });
    };

    const approveProfile = () => {
        setState({
            ...state,
            profileApproveLoading: true
        });
        if (!window.confirm("Are you sure ?"))
            return;



        const config = {
            headers: {
                Authorization: `Bearer ${state.adminToken
                    }`
            }
        };
        const data = {};
        axios.post(process.env.REACT_APP_NODE_URL + "/student/approveProfile?id=" + sId, data, config).then((res) => {
            if (res.data.status == "1") {
                alert(res.data.message);
                setState({
                    ...state,
                    studentProfile: {
                        ...state.studentProfile,
                        status: "APPROVED"
                    },
                    profileApproveLoading: false
                });
                return;
            }
            alert(res.data.message);

            // setState({
            //    ...state,
            //     agentProfile: res.data.details.agent,
            //     isWaiting: false,
            // })
        });
    };

    const handleInput = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };
    // const handleFile = (event) => {
    //     setState({
    //         ...state,
    //         [event.target.name]: event.target.files[0]
    //     })
    // }

    const addRemark = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${state.adminToken
                    }`
            }
        };
        let body = {
            userId: sId,
            text: state.remark
        };
        axios.post(process.env.REACT_APP_NODE_URL + "/student/setRemark", body, config).then((res) => {
            console.log(res.data.details);
            setState({
                ...state,
                remark: "",
                popup: false,
                remarksList: [
                    res.data.details.newRemark,
                    ...state.remarksList
                ]
            });
        });
    };

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
                                    {/* <h2 className={
                                        `${tab == 1 && "active"
                                        }`
                                    }
                                        onClick={
                                            () => setTab(1)
                                        }>
                                        Basic
                                    </h2> */}
                                    <h2 className={
                                        `${tab == 2 && "active"
                                        }`
                                    }
                                        onClick={
                                            () => setTab(2)
                                        }>
                                        Documents
                                    </h2>
                                    {/* <h2 className={
                                        `${tab == 3 && "active"
                                        }`
                                    }
                                        onClick={
                                            () => setTab(3)
                                        }>
                                        Remarks
                                    </h2> */}
                                    {/* <h2 className={`${tab == 3 && "active"}`} onClick={() => setTab(3)}>Additional Details</h2> */} </div>
                                <div className={
                                    `tabDetail ${tab == 1 && "active"
                                    }`
                                }>
                                    <tr className="py-0">
                                        <div className="p-2 flex flex-col">
                                            <th>Email :</th>
                                            <td className="lowercase">
                                                {
                                                    state.studentProfile?.email || ""
                                                } </td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>First Name :</th>
                                            <td>{
                                                state.studentProfile?.firstName
                                            }</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Last Name :</th>
                                            <td>{
                                                state.studentProfile?.lastName
                                            }</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Phone :</th>
                                            <td>{
                                                state.studentProfile?.phone || "---"
                                            }</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th></th>
                                            <td></td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Street :</th>
                                            <td>{
                                                state.studentProfile?.street || "---"
                                            }</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>City :</th>
                                            <td>{
                                                state.studentProfile?.city || "---"
                                            }</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>State :</th>
                                            <td>{
                                                state.studentProfile?.state || "---"
                                            }</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Country :</th>
                                            <td>{
                                                state.studentProfile?.country || "---"
                                            }</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Postal Code :</th>
                                            <td>{
                                                state.studentProfile?.postal_code || "---"
                                            }</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th></th>
                                            <td></td>
                                        </div>
                                    </tr>
                                </div>
                                <div className={
                                    `tabDetail docs ${tab == 2 && "active"
                                    }`
                                }>
                                    {
                                        state.studentProfile.documents.length == 0 ? (
                                            <div className="text-[red] w-full text-center m-3">
                                                No Documents
                                            </div>
                                        ) : (
                                            <div className="text-[red] w-full text-center m-3"></div>
                                        )
                                    }
                                    {/* <div className="flex justify-end w-full">
                                        {
                                            state.studentProfile.status != "APPROVED" ? (
                                                <div className="flex items-center justify-center">
                                                    <span className="text-[green] m-10 font-bold">
                                                        In-Process
                                                    </span>
                                                    <button onClick={approveProfile}
                                                        className="m-2 bg-gradient-primary px-4 py-2 rounded text-white">
                                                        {
                                                            state.profileApproveLoading ? (
                                                                <div aria-label="Loading..." role="status">
                                                                    <svg class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
                                                                        <path class="fill-gray-200" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
                                                                        <path class="fill-gray-800" d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <>Approve Profile</>
                                                            )
                                                        } </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <span className="text-[green] m-10 font-bold">
                                                        Student Approved
                                                    </span>
                                                    <button onClick={unApproveProfile}
                                                        className="m-2 bg-[red] px-4 py-2 rounded text-white">
                                                        {
                                                            state.profileApproveLoading ? (
                                                                <div aria-label="Loading..." role="status">
                                                                    <svg class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
                                                                        <path class="fill-gray-200" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
                                                                        <path class="fill-gray-800" d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <>Switch To In-Process</>
                                                            )
                                                        } </button>
                                                </div>
                                            )
                                        } </div> */}
                                    <table className="table-fixed w-full p-2 pt-0">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody> {
                                            state.studentProfile.documents.map((document, DocIndex) => {
                                                return (
                                                    <tr key={DocIndex}
                                                        className="px-2 docRow">
                                                        <td className="flex items-center">
                                                            {
                                                                document.document_title
                                                            } </td>

                                                        <td className="flex items-center justify-end">
                                                            {
                                                                document.document_status == "PENDING" ? <>PENDING</> : document.document_status == "UNDER_VERIFICATION" ? (
                                                                    <>
                                                                        <button className="approve"
                                                                            onClick={
                                                                                () => approveDocStatus(DocIndex)
                                                                            }>
                                                                            Approve
                                                                        </button>
                                                                        <button className="decline"
                                                                            onClick={
                                                                                () => toggleRemarkPopup(DocIndex)
                                                                            }>
                                                                            Decline
                                                                        </button>
                                                                        <span className="flex items-center justify-end downloadSvg" title="Download">
                                                                            <a href={
                                                                                state.baseUrl + document.document_url
                                                                            }
                                                                                download="companylogo"
                                                                                target={"_blank"}>
                                                                                <svg style={
                                                                                    { width: "20px" }
                                                                                }
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                                            </a>
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <> {
                                                                        document.document_status == "APPROVED" ? (
                                                                            <div className="approved_status">
                                                                                Approved
                                                                            </div>
                                                                        ) : (
                                                                            <div className="declined_status">
                                                                                Declined
                                                                            </div>
                                                                        )
                                                                    }
                                                                        <span className="flex items-center justify-end downloadSvg" title="Download">
                                                                            <a href={
                                                                                state.baseUrl + document.document_url
                                                                            }
                                                                                download="companylogo"
                                                                                target={"_blank"}>
                                                                                <svg style={
                                                                                    { width: "20px" }
                                                                                }
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                                            </a>
                                                                        </span>
                                                                    </>

                                                                )
                                                            }

                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        } </tbody>
                                    </table>
                                    <div className="w-full p-[10px] flex">
                                        <div class="relative mr-2">
                                            <input type="checkbox" name="" id="isApproved" className="mr-2" onClick={()=>setCheckBox(!checkbox)}/>
                                            <span className="font-black" htmlFor="">File Status Changed to In-Process</span>
                                        </div>
                                    </div>
                                    <div className="w-full p-[10px] flex justify-end">
                                        <ButtonPrimary title={"Submit"} onclick={approveFileNow} loading={state.approveFileLoading} />
                                    </div>
                                    {/* <div className="profile-image">
                                        <label htmlFor="">Profile Image</label>
                                        {
                                            state.studentProfile?.profile_image ?
                                                <img src={`http://localhost:3006/uploads/agent/${state.studentProfile?.profile_image}`} alt="" /> :
                                                <>Pending</>
                                        }
                                    </div>
                                    <div className="company-logo">
                                        <label htmlFor="">Company Logo</label>
                                        {
                                            state.studentProfile?.company_logo ?
                                                <img src={`http://localhost:3006/uploads/agent/${state.studentProfile?.company_logo}`} alt="" /> :
                                                <>Pending</>
                                        }
                                    </div>
                                    <div className="certificate-pdf">
                                        <label htmlFor="">Business Certificate</label>
                                        {
                                            state.studentProfile?.business_certificate ?
                                                <>
                                                    <p className="text-center text-sm">{state.studentProfile?.business_certificate}</p>
                                                    <span onClick={() => window.open(`http://localhost:3006/uploads/agent/${state.studentProfile?.business_certificate}`, "_blank")}>Open</span>
                                                </> :
                                                <>Pending</>
                                        }

                                    </div> */} </div>
                                {/* <div className={
                                    `tabDetail ${tab == 3 && "active"
                                    }`
                                }>
                                    <div className={
                                        `overlay ${state.popup == true ? "active" : ""
                                        }`
                                    }
                                        onClick={
                                            () => setState({
                                                ...state,
                                                popup: false
                                            })
                                        }></div>
                                    <div className={
                                        `pendingDocAlert popup  ${state.popup == true ? "active" : ""
                                        }`
                                    }>
                                        <div class="w-full">
                                            <h1 class="text-3xl font-bold mb-5 bg-[white] text-[black]">
                                                Send Remark
                                            </h1>
                                            <div class="mb-5">
                                                <label for="document-type" class="block font-medium mb-2">
                                                    Remark:
                                                </label>
                                                <input className="border px-4 py-2 w-full" type="text" name="remark" placeholder="Type here..."
                                                    onChange={handleInput} />
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={addRemark}
                                                    type="submit"
                                                    class="px-4 py-2 bg-gradient-primary text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end p-[10px] w-full">
                                        <button className="px-4 py-2 bg-gradient-primary text-white rounded"
                                            onClick={
                                                () => {
                                                    setState({
                                                        ...state,
                                                        popup: true
                                                    });
                                                }
                                            }>
                                            Add Remark
                                        </button>
                                    </div>
                                    <ul className="remarks-list">
                                        {
                                            state.remarksList.map((remark, index) => {
                                                return (
                                                    <li key={index}>
                                                        <div> {
                                                            index + 1
                                                        }. {
                                                                remark.text
                                                            } </div>
                                                        <div> {
                                                            remark.user_details.first_name
                                                        }
                                                            ( {
                                                                remark.user_details.email
                                                            })
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        } </ul>
                                </div> */}
                                {/* <div className={`tabDetail ${tab == 3 && "active"}`}>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Principal Country of Business :</th>
                                            <td>{state.studentProfile?.principal_country_of_business || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Company Name :</th>
                                            <td>{state.studentProfile?.company_name || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Cellphone :</th>
                                            <td>{state.studentProfile?.cellphone || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Facebook Page :</th>
                                            <td>{state.studentProfile?.facebook_page_name || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Skype Id :</th>
                                            <td>{state.studentProfile?.skype_ID || "---"}</td>
                                        </div>
                                        <div className="p-2 flex flex-col">
                                            <th>Whatsapp Id :</th>
                                            <td>{state.studentProfile?.whatsapp_ID || "---"}</td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <div className="p-2 flex flex-col">
                                            <th>Instagram Handle :</th>
                                            <td>{state.studentProfile?.instagram_handle || "---"}</td>
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
                                </div> */} </table>
                        </div>
                    </div>
                </>
            </div>
            <RemarkPopup />
        </>
    );
};

export default StudentDocumentsPopup;
