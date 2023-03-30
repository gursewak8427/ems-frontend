import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import StudentDashboard from "../Screens/Dashboard/StudentDashboard";

const StudentRemarks = (props) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    isWaiting: true,
    history: [],
    baseUrl: "",
  });

  const { fileId } = useParams()

  useEffect(() => {
    // get enrolled list data from api using axios
    const config = {
      headers: { Authorization: `Bearer ${getToken("student")}` },
    };
    let body = {
      fileId
    }
    axios
      .post(process.env.REACT_APP_NODE_URL + "/student/getRemarks", body, config)
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          history: res.data.details.history,
          isWaiting: false,
          // baseUrl: res.data.details.baseUrl
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <>
        <>
          {/* table and row */}

          <div className="card m-4">
            <div className="card-body px-0 pt-0 pb-2">
              <div className="table-responsive p-0 dashbord-table">
                <table className="table w-full">
                  <thead>
                    <tr>
                      {/* 
                                Logo, File Id, Country, School Name, Course, Application Fees, ESL, Fees Paid, In Take, Payment, Action,  */}
                      <th
                        className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                        scope="col"
                      >
                        Sr.
                      </th>
                      <th
                        className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                        scope="col"
                      >
                        Program
                      </th>
                      <th
                        className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                        scope="col"
                      >
                        School
                      </th>
                      <th
                        className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                        scope="col"
                      >
                        History
                      </th>
                      <th
                        className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                        scope="col"
                      >
                        User
                      </th>
                      <th
                        className="border-2 border-black p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left"
                        scope="col"
                      >
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.isWaiting ? (
                      <></>
                    ) : (
                      state.history.map((history, index) => {
                        return (
                          <tr key={history._id}>
                            <td className="p-2 border-2">{index + 1}</td>
                            <td className="p-2 border-2">{history.content}</td>
                            <td className="p-2 border-2"></td>
                            <td className="p-2 border-2"></td>
                            <td className="p-2 border-2"></td>
                            <td className="p-2 border-2">{(history.createdAt)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                {state.isWaiting ? (
                  <center className="w-full my-10">
                    <img width={80} src="https://i.gifer.com/ZZ5H.gif" alt="" />
                  </center>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      </>
    </>
  );
};

export default StudentRemarks;
