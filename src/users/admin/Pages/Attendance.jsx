import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useParams } from "react-router-dom";
import { getCookie, getToken, setCookie } from "../../../helper/auth";
import Papa from "papaparse";
import Dashboard from "../Screens/Dashboard/Dashboard";
// import "./AddCountry.css";
import { useDropzone } from "react-dropzone";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

// web-socket
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3006";
// console.log("COnnecting")
// var socket = socketIOClient(ENDPOINT);

const Attendance = () => {
  const { teamId } = useParams()
  const [state, setState] = useState({
    isWait: false,
    list: [],
  });

  const [tab, setTab] = useState(1)

  var config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };

  const forToday = () => {
    let date = (new Date()).toLocaleDateString()
    let dateArr = date.split("/")
    let day = dateArr[0]
    let month = dateArr[1]
    let year = dateArr[2]
    axios
      .post(process.env.REACT_APP_NODE_URL + `/users/getAllAttendaceByDate`, {
        day, month, year
      }, config)
      .then((attendaceResponse) => {
        console.log(attendaceResponse);
        setState({
          ...state,
          list: attendaceResponse.data.details.totalAttendances,
          isWait: false
        });
      }, []);
  };

  const forDate = () => {
    let day = document.getElementById("a").value
    let month = document.getElementById("b").value
    let year = document.getElementById("c").value
    axios
      .post(process.env.REACT_APP_NODE_URL + `/users/getAllAttendaceByDate`, {
        day, month, year
      }, config)
      .then((attendaceResponse) => {
        console.log(attendaceResponse);
        setState({
          ...state,
          list: attendaceResponse.data.details.totalAttendances,
          isWait: false
        });
      }, []);
  };


  const forUser = () => {
    let email = document.getElementById("userEmail").value
    axios
      .post(process.env.REACT_APP_NODE_URL + `/users/getAllAttendaceByEmail`, {
        email
      }, config)
      .then((attendaceResponse) => {
        console.log(attendaceResponse);
        if (attendaceResponse.data.status == "0") {
          alert(attendaceResponse.data.message)
        }
        setState({
          ...state,
          list: attendaceResponse.data.details.totalAttendances,
          isWait: false
        });
      }, []);
  };



  if (state.isWait) {
    return "Loading..."
  }

  return (
    <>
      <div className="agentDetailsAsideBar" heading_title={"Attendance"}>
        <table className="table-responsive">
          <div className="tabs">
            <div className="tabs">
              <h2 className={`${tab == 1 && "active"}`} onClick={() => setTab(1)}>Find By Date</h2>
              <h2 className={`${tab == 2 && "active"}`} onClick={() => setTab(2)}>Find By User</h2>
            </div>
          </div>


          {
            tab == 1 && (
              <>
                <div className="table-responsive">
                  <div className="m-2">
                    <span className="m-2"><ButtonPrimary onclick={forToday} theme="danger" title={"Today"} /></span>
                    ||
                    {/* make inputs with day, month and year */}
                    <input type="text" id="a" placeholder="Day" className="m-2 rounded border border-current  h-9 p-2" />
                    <input type="text" id="b" placeholder="Month" className="m-2 rounded border border-current  h-9 p-2" />
                    <input type="text" id="c" placeholder="Year" className="m-2 rounded border border-current  h-9 p-2" />
                    <ButtonPrimary title={"Find"} onclick={forDate} />


                  </div>

                </div>
                <thead className="px-5 w-full">

                  <tr>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        Sr.
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        Date
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col">
                      <span className="text-black text-xl font-black">
                        Time
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        User
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        Status
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="px-5 w-full">

                  {
                    state.list.map((item, index) => {
                      return <tr>
                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >{index + 1}</td>

                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {`${item.day}/${item.month}/${item.year}`}
                        </td>

                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {
                            item.attendance == "PENDING" ?
                              "--" : `${item.hour}:${item.minute}`
                          }
                        </td>
                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {item?.user_id?.email}
                        </td>

                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {item.attendance}
                        </td>

                      </tr>
                    })
                  }

                </tbody>
              </>


            )
          }

          {
            tab == 2 && (
              <>
                <div className="table-responsive">
                  <div className="m-2">
                    <input type="text" id="userEmail" placeholder="User Email" className="m-2 rounded border border-current  h-9 p-2" />
                    <ButtonPrimary title={"Find"} onclick={forUser} />


                  </div>

                </div>
                <thead className="px-5 w-full">

                  <tr>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        Sr.
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        Date
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col">
                      <span className="text-black text-xl font-black">
                        Time
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        User
                      </span>
                    </th>
                    <th
                      className="border-2 p-4 text-xl text-uppercase"
                      scope="col"
                    >
                      <span className="text-black text-xl font-black">
                        Status
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="px-5 w-full">

                  {
                    state.list.map((item, index) => {
                      return <tr>
                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >{index + 1}</td>

                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {`${item.day}/${item.month}/${item.year}`}
                        </td>

                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {
                            item.attendance == "PENDING" ?
                              "--" : `${item.hour}:${item.minute}`
                          }
                        </td>
                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {item?.user_id?.email}
                        </td>

                        <td
                          className="border-2 p-4 text-xl text-uppercase"
                        >
                          {item.attendance}
                        </td>

                      </tr>
                    })
                  }

                </tbody>
              </>


            )
          }


        </table>
      </div>
    </>
  );
};

export default Attendance;
