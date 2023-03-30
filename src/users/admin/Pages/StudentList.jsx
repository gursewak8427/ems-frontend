import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const StudentList = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    isWaiting: false,
    students: [],
    adminToken: getToken("admin"),
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    getPaginationData(1);
  }, []);

  const getPaginationData = (page) => {
    setState({
      ...state,
      isWaiting: true,
    });
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = { currentPage: page };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getstudents", data, config)
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          students: res.data.details.students,
          totalPages: res.data.details.totalPages,
          currentPage: res.data.details.currentPage,
          isWaiting: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        setState({
          isWaiting: false,
        });
        alert(err.response.data.message);
      });
  };

  return (
    <>
      <div heading_title={"Total Students"}>
        <>
          <div className="row min-height-vh-100 mt-10">
            <div className="row p-45">
              <div className="w-full">
                <div className="shadow-lg mb-4 mt-4 border">
                  <div className="px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 agent-table">
                      <table className="table w-full mb-0">
                        <thead>
                          <tr>
                            <th className="p-2">Id</th>
                            {/* <th className="p-2 text-left">Image</th> */}
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Agent Details</th>
                            <th className="p-2 text-left">Phone</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Address</th>
                            <th className="p-2">Recent Activity</th>
                            <th className="p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.isWaiting ? (
                            <></>
                          ) : (
                            state.students.map((student, index) => {
                              return (
                                <tr>
                                  <td className="p-1  text-center">
                                    <p className="text-xs font-weight-bold mb-0">
                                      {index + 1}
                                    </p>
                                  </td>
                                  {/* <td className="p-1">
                                    <img
                                      width={"50px"}
                                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxLDEajEW8QIw_X_Zt5S-1rxj0-lhuljenolf6zjfThRco-WTZIlp_QU-BIFFBhjhp9uM&usqp=CAU"
                                      className="avatar avatar-sm me-3 rounded"
                                      alt="user1"
                                    />
                                  </td> */}
                                  <td
                                    className="p-1 border-2 text-left cursor-pointer"
                                    // onClick={() =>
                                    //   navigate(
                                    //     "/d/admin/studentprofile?id=" +
                                    //       student._id
                                    //   )
                                    // }
                                  >
                                    <span className="text-secondary text-xs font-weight-bold capitalize">
                                      {student.firstName} {student.lastName}
                                    </span>
                                  </td>

                                  <td className="p-1 border-2 text-left">
                                    <span className="text-secondary text-xs font-weight-bold">
                                      {student?.agent_id ? (
                                        <span>
                                          <span className="capitalize">
                                            {`${student?.agent_id?.first_name} ${student?.agent_id?.last_name}`}
                                          </span>
                                          <br />
                                          {student?.agent_id?.email || "--"}
                                        </span>
                                      ) : (
                                        "--"
                                      )}
                                    </span>
                                  </td>
                                  <td className="p-1 border-2 text-left">
                                    <span className="text-secondary text-xs font-weight-bold">
                                      {student?.phone || "--"}
                                    </span>
                                  </td>
                                  <td className="p-1 border-2 text-left">
                                    <span className="text-secondary text-xs font-weight-bold">
                                      {student.email}
                                    </span>
                                  </td>
                                  <td className="p-1 border-2 text-left">
                                    <span className="text-secondary text-xs font-weight-bold capitalize">
                                      {student?.country
                                        ? `${student?.city}, ${student?.state}, ${student?.country}`
                                        : "--"}
                                    </span>
                                  </td>
                                  <td className="p-1 border-2 text-center">
                                    <span className="text-secondary text-xs font-weight-bold">
                                      {new Date(
                                        student.updatedAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </td>
                                  <td className="p-1 border-2 text-center">
                                    <div className="action-icons-list">
                                      <svg
                                        className="action-icon"
                                        onClick={() =>
                                          navigate(
                                            "/d/admin/studentprofile?id=" +
                                              student._id
                                          )
                                        }
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                      </svg>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
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
                  <div className="card-footer pb-0">
                    {/* pagination is here */}
                    <div className="pagination">
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
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default StudentList;
