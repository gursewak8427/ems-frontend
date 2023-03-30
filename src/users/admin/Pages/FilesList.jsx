import axios from "axios";
import { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
import ReactPaginate from "react-paginate";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";
import AdminStudentProfile from "./AdminStudentProfile";
import StudentDocumentsPopup from "./StudentDocumentsPopup";

const FilesList = ({ type }) => {
  const navigate = useNavigate();
  const [ModalCode, setModalCode] = useState(false);
  const [activeStudentId, setActiveStudentId] = useState(-1)
  const [activeFileId, setActiveFileId] = useState(-1)
  
  const [state, setState] = useState({
    isWaiting: false,
    files: [],
    baseUrl: "",
    adminToken: getToken("admin"),
    totalPages: 0,
    currentPage: 1,
    remark: "",
    approveFileLoading: -1,
  });

  // const [tab, setTab] = useState(0)

  useEffect(() => {
    getPaginationData(1);
  }, [window.location.href]);

  const getPaginationData = (page) => {
    setState({
      ...state,
      isWaiting: true,
    });
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    if (type == "REJECTED") {
      var data = { currentPage: page, type: "UNDER_VERIFICATION" };
    } else {
      var data = { currentPage: page, type };
    }
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/admin/getEnrollPrograms",
        data,
        config
      )
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          files: res.data.details.files,
          baseUrl: res.data.details.baseUrl,
          isWaiting: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        setState({
          isWaiting: false,
        });
        alert(err);
      });
  };

  const sendRemark = (fileId, index) => {
    let content = document.getElementById("remark_" + index).value;
    if (content == "") return false;

    let data = {
      content,
      fileId,
    };

    const config = {
      headers: { Authorization: `Bearer ${getToken("admin")}` },
    };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/sendRemark", data, config)
      .then((res) => {
        console.log(res);
        alert("Remark updated successfully");
        document.getElementById("remark_" + index).value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approveFileNow = (fileId, index) => {
    if (window.confirm("Are you sure ?")) {
      // now update
      setState({
        ...state,
        approveFileLoading: index,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${state.adminToken}`,
        },
      };

      const data = {
        fileId: fileId,
        status: "FEES_PENDING",
      };

      axios
        .patch(
          process.env.REACT_APP_NODE_URL + "/admin/updateEnrollStatus",
          data,
          config
        )
        .then((res) => {
          let OldFiles = state.files;
          // splice that index
          OldFiles.splice(index, 1);
          setState({
            files: OldFiles,
            approveFileLoading: -1,
          });
          alert(res.data.message);

          // setState({
          //     ...state,
          //     agentProfile: res.data.details.agent,
          //     isWaiting: false,
          // })
        })
        .catch((err) => {
          console.log({ updateEnrollStatus_Error: err });
          setState({
            ...state,
            approveFileLoading: -1,
          });
        });
    }
  };

  const closeFile = (fileId, index) => {
    if (window.confirm("Are you sure ?")) {
      // now update
      setState({
        ...state,
        approveFileLoading: index,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${state.adminToken}`,
        },
      };

      const data = {
        fileId: fileId,
        status: "CLOSED",
      };

      axios
        .patch(
          process.env.REACT_APP_NODE_URL + "/admin/updateEnrollStatus",
          data,
          config
        )
        .then((res) => {
          let OldFiles = state.files;
          // splice that index
          OldFiles.splice(index, 1);
          setState({
            files: OldFiles,
            approveFileLoading: -1,
          });
          alert(res.data.message);

          // setState({
          //     ...state,
          //     agentProfile: res.data.details.agent,
          //     isWaiting: false,
          // })
        })
        .catch((err) => {
          console.log({ updateEnrollStatus_Error: err });
          setState({
            ...state,
            approveFileLoading: -1,
          });
        });
    }
  };

  return (
    <>
      <div heading_title={"Total Students"}>

        <>
          {ModalCode ? (
            <div className="modal_cover">
              <div className="modal_inner select-col-popup">
                <div className="header_modal files_documents">
                  <StudentDocumentsPopup setModalCode={setModalCode} sId={activeStudentId} fId={activeFileId} documents={true}/>
                  

                  <GrClose
                    className="close"
                    onClick={() => setModalCode(false)}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="files row min-height-vh-100 mt-10">
            <div className="card mb-4 mt-2">
              <div className="card-body px-0 pt-0 pb-2">
                <div className="overflow-auto card shadow-lg m-4 col-12 px-0 pt-0 pb-2 agent-table border">
                  <table className="table-auto overflow-scroll w-full files-table">
                    <thead>
                      <tr>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Logo
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          File Id
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Student Name
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Country
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          School Name
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Course
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Application Fees
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          ESL
                        </th>
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Fees Paid
                        </th>
                        {(type == "IN_PROCESSING" || type == "CLOSED") && (
                          <th
                            className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                            scope="col"
                          >
                            Payment Id
                          </th>
                        )}
                        {(type == "IN_PROCESSING" || type == "CLOSED") && (
                          <th
                            className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                            scope="col"
                          >
                            Intake
                          </th>
                        )}
                        {/* {type == "UNDER_VERIFICATION" && (
                          <th
                            className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                            scope="col"
                          >
                            Payment
                          </th>
                        )} */}
                        <th
                          className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                          scope="col"
                        >
                          Date
                        </th>
                        {true && (
                          <th
                            className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                            scope="col"
                          >
                            Remark
                          </th>
                        )}
                        {true && (
                          <th
                            className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                            scope="col"
                          >
                            Action
                          </th>
                        )}
                        {type == "IN_PROCESSING" && (
                          <th
                            className="border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                            scope="col"
                          >
                            Completed
                          </th>
                        )}
                        {
                          type != "PENDING" &&
                          <th>Documents</th>
                        }
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.files.map((enroll, index) => {
                        if (type == "REJECTED") {
                          if (
                            enroll.student_details.status != "DOC_REJECTED"
                          )
                            return <></>;
                        }
                        if (type == "UNDER_VERIFICATION") {
                          if (
                            enroll.student_details.status == "DOC_REJECTED"
                          )
                            return <></>;
                        }
                        return (
                          <tr>
                            <td
                              className="border-2 p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                              scope="col"
                            >
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
                            <td className="p-2 border-2">
                              {enroll.fileId}
                            </td>
                            <td
                              className="p-2 border-2"
                            >
                              <span className="capitalize">
                                {enroll.student_details.firstName}{" "}
                                {enroll.student_details.lastName}
                              </span>
                              {/* <br />
                                    {enroll.student_details.email} */}
                            </td>
                            <td className="p-2 border-2 capitalize">
                              {enroll.school_details.country}
                            </td>
                            <td className="p-2 border-2 capitalize">
                              {enroll.school_details.school_name}
                            </td>
                            <td
                              className="p-2 border-2 max-two-line-text hover-text"
                              title={
                                enroll.school_details?.school_programs
                                  ?.program_name || "--"
                              }
                            >
                              {/* <span class="tooltip-text top">
                                      {enroll.school_details?.school_programs
                                        ?.program_name || "--"}
                                    </span> */}
                              {enroll.school_details?.school_programs
                                ?.program_name || "--"}
                            </td>
                            <td className="p-2 border-2">
                              {enroll.school_details?.school_programs
                                ?.application_fee == 0 ? (
                                "Free"
                              ) : (
                                <>
                                  {
                                    enroll.school_details?.school_programs
                                      ?.application_fee
                                  }{" "}
                                  INR
                                </>
                              )}
                            </td>
                            <td className="p-2 border-2">{"--"}</td>
                            <td className="p-2 border-2 normal">
                              {enroll?.fees_status || "--"}
                            </td>
                            {(type == "IN_PROCESSING" ||
                              type == "CLOSED") && (
                                <td className="p-2 border-2">
                                  {enroll?.payment_id || "--"}
                                </td>
                              )}
                            {(type == "IN_PROCESSING" ||
                              type == "CLOSED") && (
                                <td className="p-2 border-2">
                                  {`${enroll?.intake?.year}-${enroll?.intake?.month}` ||
                                    "--"}
                                </td>
                              )}
                            {/* {type == "UNDER_VERIFICATION" && (
                              <td className="border-2">
                                <span className="flex align-center justify-center">
                                  <ButtonPrimary
                                    title={"Allow"}
                                    onclick={() =>
                                      approveFileNow(enroll._id, index)
                                    }
                                    loading={
                                      state.approveFileLoading == index
                                    }
                                  />
                                </span>
                              </td>
                            )} */}
                            <td className="p-2 border-2">
                              {" "}
                              {new Date(
                                enroll.createdAt
                              ).toLocaleDateString()}
                            </td>
                            {true && (
                              // {type == "IN_PROCESSING" && (
                              <td className="p-2 border-2">
                                <input
                                  name="remark"
                                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id={`remark_${index}`}
                                  type="text"
                                  placeholder="Remark.."
                                />
                              </td>
                            )}
                            {true && (
                              // {type == "IN_PROCESSING" && (
                              <td className="border-2">
                                <span className="flex justify-center w-full">
                                  <ButtonPrimary
                                    title={"Submit"}
                                    onclick={() =>
                                      sendRemark(enroll._id, index)
                                    }
                                    loading={
                                      state.approveFileLoading == index
                                    }
                                  />
                                </span>
                              </td>
                            )}
                            {type == "IN_PROCESSING" && (
                              <td className="border-2">
                                <span className="flex justify-center w-full p-2">
                                  <ButtonPrimary
                                    title={"Complete"}
                                    onclick={() =>
                                      closeFile(enroll._id, index)
                                    }
                                    loading={
                                      state.approveFileLoading == index
                                    }
                                  />
                                </span>
                              </td>
                            )}
                            {
                              type != "PENDING" && <td className="p-2 border-2">
                                <ButtonPrimary
                                  title={"Documents"}
                                  onclick={() => {
                                    setActiveStudentId(enroll.student_id)
                                    setActiveFileId(enroll._id)
                                    setModalCode(!ModalCode)
                                  }}
                                  // onclick={() =>
                                  //   navigate(
                                  //     "/d/admin/studentprofile?tab=documents&id=" +
                                  //     enroll.student_details._id
                                  //   )
                                  // }
                                  loading={
                                    state.approveFileLoading == index
                                  }
                                />


                              </td>
                            }
                            <td className="p-2 text-left">
                              <ButtonPrimary title={"Remarks"} onclick={() => {
                                navigate("/d/admin/remarks/" + enroll._id)
                              }} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {state.isWaiting ? (
                    <center className="w-full my-10">
                      <img
                        width={80}
                        src="https://i.gifer.com/ZZ5H.gif"
                        alt=""
                      />
                    </center>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* pagination is here */}
              <div className="pagination mt-2">
                <div className="pages">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next"
                    onPageChange={(event) => {
                      getPaginationData(event.selected + 1);
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
      </div>
    </>
  );
};

export default FilesList;
