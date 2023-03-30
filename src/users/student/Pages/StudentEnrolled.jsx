import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import StudentDashboard from "../Screens/Dashboard/StudentDashboard";

// firebase
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../../../firebase";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import StudentPayment from "./StudentPayment";
const provider = new GoogleAuthProvider();

const StudentEnrolled = (props) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    isWait: true,
    enrolledPrograms: [],
    student: "",
    baseUrl: "",
    pendingDocuments: true,

    // new
    documents: [],
    isDocsRequiredPopup: false,
    isDocsRequired: false,
    underVerification: false,
    disabled: false,
    paymentLoading: false,
  });

  useEffect(() => { // get enrolled list data from api using axios
    const config = {
      headers: {
        Authorization: `Bearer ${getToken("student")
          }`
      }
    };
    axios.post(process.env.REACT_APP_NODE_URL + "/student/getEnrollPrograms", {}, config).then((res) => {
      console.log(res);
      setState({
        ...state,
        enrolledPrograms: res.data.details.enrolled_list,
        student: res.data.details.student,
        baseUrl: res.data.details.baseUrl,
        isWait: false,
        documents: res.data.details.documents,
        isDocsRequired: res.data.details.isDocsRequired,
        isDocsRequiredPopup: res.data.details.isDocsRequired,
        underVerification: res.data.details.underVerification
      });
    }).catch((err) => {
      console.log(err);
    });
  }, []);

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


  return (<>
    {
      state.isDocsRequiredPopup || state.student.status == "DOC_REJECTED" ? (
        <>
          <div className="overlay active"
            onClick={
              () => setState({
                ...state,
                isDocsRequiredPopup: false,
                student: {
                  ...state.student,
                  status: "IN_PROCESS_TEMP",
                }
              })
            }></div>
          <div className="pendingDocAlert popup active">
            {/* <div className="cross flex justify-end">
              <span className="mb-2 rounded-full w-[40px] h-[40px] bg-[red] text-[white] items-center justify-center flex cursor-pointer hover:bg-[darkred]">X</span>
            </div> */}
            <div class="pending-documents">
              <i class="fas fa-exclamation-circle"></i>
              <h2>Pending Documents</h2>
              <p>
                Please Uploads required documents to approve your application.
              </p>
              <button onClick={
                () => {
                  setState({
                    ...state,
                    isPendingProgramPopupShow: false
                  })
                  navigate("/d/student/documents")
                }
              }>
                View Required Documents
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )
    }


    {
      (!state.disabled && state.isDocsRequired) || state.student.status == "IN_PROCESS_TEMP" ? <>
        <div class="mx-[20px] my-[10px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" id="alert_1">
          <strong class="font-bold">Hey, <span className="capitalize">{state.student.firstName}</span>! </strong>
          <span class="block sm:inline">Your documents are pending.</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => document.getElementById("alert_1").classList.add("hidden")}>
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>
      </> :
        (!state.disabled && state.underVerification && state.student.status == "IN_PROCESS") &&
        <div class="mx-[20px] my-[10px] bg-blue-500 text-white text-sm font-bold px-4 py-3 flex" role="alert" id="alert_2">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
          <p>Your document's verification is in the processing.</p>
        </div>
    }
    <div className="overflow-auto card shadow-lg m-4 col-12 px-0 pt-0 pb-2 agent-table border">
      <table className="table-auto overflow-scroll w-full files-table">
        <thead>
          <tr>
            {/* Logo, File Id, Country, School Name, Course, Application Fees, ESL, Fees Paid, In Take, Payment, Action,  */}
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Country Logo
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              School Logo
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              File Id
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Country
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              School Name
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Course
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Application Fees
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              ESL
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Fees Paid
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Payment Id
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              In Take
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Payment
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Status
            </th>
            <th
              className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
              scope="col"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {state.isWait ? (
            <></>
          ) : (
            state.enrolledPrograms.map((enroll, index) => {
              return (
                <tr key={enroll.fileId}>
                  <td className="p-2 border-2">
                    <img
                      width={"100px"}
                      src={
                        state.baseUrl +
                        enroll.school_details.school_meta_details
                          .countryLogo
                      }
                      alt="logo"
                      className=""
                    />
                  </td>
                  <td className="p-2 border-2">
                    <img
                      width={"100px"}
                      src={
                        state.baseUrl +
                        enroll.school_details.school_meta_details
                          .schoolLogo
                      }
                      alt="logo"
                      className="img-fluid"
                    />
                  </td>
                  <td onClick={() => navigate("/d/student/remarks/" + enroll._id)} className="p-2 border-2 cursor-pointer hover:underline">{enroll.fileId}</td>
                  <td className="p-2 border-2">
                    {enroll.school_details.country}
                  </td>
                  <td className="p-2 border-2 capitalize">
                    {enroll.school_details.school_name}
                  </td>
                  <td className="p-2 border-2 capitalize">
                    {enroll.school_details?.school_programs
                      ?.program_name || "--"}
                  </td>
                  <td className="p-2 border-2 capitalize">
                    {enroll.school_details?.school_programs
                      ?.application_fee == 0
                      ? "Free"
                      : <>{enroll.school_details?.school_programs?.application_fee} {enroll.school_details?.school_programs?.currency}</>
                    }
                  </td>
                  <td className="p-2 border-2">{"--"}</td>
                  <td className="p-2 border-2">
                    {enroll.fees_status}
                  </td>
                  <td className="p-2 border-2">
                    {enroll.payment_id || "--"}
                  </td>
                  <td className="p-2 border-2 text-center">
                    {
                      enroll.fees_status == "PENDING" ?
                        <select name="intakes" id={`selectedIntake_${index}`} className="p-2">
                          <option value="">--Select--</option>
                          {
                            // USE map to show intakes under school_details.school_programs.intakes_data
                            enroll.school_details.school_programs.intakes_data.map(
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
                          {monthsArr[enroll.intake.month - 1]}, {enroll.intake.year}
                        </>
                    }
                  </td>
                  <td className="p-2 border-2 text-center">
                    {
                      enroll.enroll_status == "FEES_PENDING" ?
                        <div className={`mx-auto flex justify-center payBtn payBtn_${index}`}>
                          <span className="first">
                            <StudentPayment index={index} enrollId={enroll._id} state={state} setState={setState} />
                            {/* <ButtonPrimary title={"Pay"} onclick={_ => payNow(enroll, index)} loading={false} /> */}
                          </span>
                          <span className="second">
                            <StudentPayment index={index} enrollId={enroll._id} state={state} setState={setState} />
                            {/* <ButtonPrimary title={"Pay"} onclick={_ => payNow(enroll, index)} loading={true} /> */}
                          </span>
                        </div> : enroll.enroll_status == "PENDING" || enroll.enroll_status == "UNDER_VERIFICATION" ? <span>
                          <ButtonPrimary title={"Pay"} onclick={() => alert("Your document's verification is pending!")} loading={false} />
                        </span> : "--"
                    }
                  </td>
                  <td className="p-2 border-2">
                    <button>{enroll.enroll_status}</button>
                  </td>
                  <td className="p-2 border-2">
                    {/* <button>Delete</button> */}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
    {state.isWait ? (
      <center className="w-full my-10">
        <img width={80} src="https://i.gifer.com/ZZ5H.gif" alt="" />
      </center>
    ) : (
      <></>
    )}
  </>
  );
};

export default StudentEnrolled;
