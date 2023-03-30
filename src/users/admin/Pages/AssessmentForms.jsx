import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Navigate, redirect } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const AssessmentForms = () => {
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
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = { currentPage: page };
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/admin/getassessmentforms",
        data,
        config
      )
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
      });
  };

  return (
    <>
      <div heading_title={"Total Students"}>
        <>
          <div className="row min-height-vh-100">
            <div className="row p-45">
              <div className="col-12">
                <div className="card mb-4 mt-4">
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table w-full mb-0 agent-table">
                        <thead>
                          <tr>
                            <th className="text-left  p-2 ">Sr.</th>
                            <th className="text-left  p-2 ">First Name</th>
                            <th className="text-left  p-2 ">Last Name</th>
                            <th className="text-left  p-2 ">Phone</th>
                            <th className="text-left  p-2 ">Email</th>
                            <th className="text-left  p-2 ">Country</th>
                            <th className="text-left  p-2 ">Created</th>
                            {/* <th className="text-left border-2 p-2 align-middle">Status</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {state.students.map((student, index) => {
                            return (
                              <tr>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {index + 1}
                                  </p>
                                </td>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {student.first_name}
                                  </p>
                                </td>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {student.last_name}
                                  </p>
                                </td>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {student.phone}
                                  </p>
                                </td>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {student.email}
                                  </p>
                                </td>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {student.destination_country}
                                  </p>
                                </td>
                                <td className="p-2 text-left">
                                  <p className="text-xs font-weight-bold mb-0">
                                    {new Date(
                                      parseInt(student.created)
                                    ).toLocaleDateString()}
                                  </p>
                                </td>
                                {/* <td className="p-2 align-middle">
                                                                    <a href="javascript:;" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                                                        {student.status}
                                                                    </a>
                                                                </td> */}
                              </tr>
                            );
                          })}
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

export default AssessmentForms;
