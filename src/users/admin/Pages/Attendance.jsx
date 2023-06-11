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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  const [AttendanceObj, setAttendanceObj] = useState({
    present: [],
    absent: [],
    leave: [],
    paidLeave: [],
  })
  const [monthAttendaceObj, setMonthAttendaceObj] = useState({
    present: [],
    absent: [],
    leave: [],
    paidLeave: [],
  })


  const [tab, setTab] = useState(1)
  const [value, onChange] = useState(new Date());
  const [month, setMonth] = useState("");

  var config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };

  useEffect(() => {
    // Filter AttendaceObj with this month
    let monthAttendaceObj2 = {
      present: [],
      absent: [],
      leave: [],
      paidLeave: [],
    }
    let OldAttendaceObj = AttendanceObj;
    monthAttendaceObj2.present = OldAttendaceObj.present.filter(date => date.split("/")[0] == month)
    monthAttendaceObj2.absent = OldAttendaceObj.absent.filter(date => date.split("/")[0] == month)
    monthAttendaceObj2.leave = OldAttendaceObj.leave.filter(date => date.split("/")[0] == month)
    monthAttendaceObj2.paidLeave = OldAttendaceObj.paidLeave.filter(date => date.split("/")[0] == month)
    setMonthAttendaceObj(monthAttendaceObj2)
  }, [month])

  const forToday = () => {
    let date = (new Date()).toLocaleDateString()
    let dateArr = date.split("/")
    console.log({ dateArr });
    let day = dateArr[1]
    let month = dateArr[0]
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
    let OldAttendanceObj = {
      present: [],
      absent: [],
      leave: [],
      paidLeave: [],
    }
    let email = document.getElementById("userEmail").value
    axios
      .post(process.env.REACT_APP_NODE_URL + `/users/getAllAttendaceByEmail`, {
        email
      }, config)
      .then(async (attendaceResponse) => {
        console.log(attendaceResponse);
        if (attendaceResponse.data.status === "0") {
          alert(attendaceResponse.data.message)
          return;
        }
        attendaceResponse.data.details.totalAttendances.map(async (attendance, index) => {
          if (attendance.attendance === "PRESENT") {
            OldAttendanceObj.present.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
          } else if (attendance.attendance === "ABSENT") {
            OldAttendanceObj.absent.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
          } else if (attendance.attendance === "LEAVE") {
            OldAttendanceObj.leave.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
          } else if (attendance.attendance === "PAID_LEAVE") {
            OldAttendanceObj.paidLeave.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
          } else if (attendance.attendance === "PENDING") {
            console.log("PENDING");
            // Check for leave for current date month
            let leaveResponse = await axios
              .post(process.env.REACT_APP_NODE_URL + `/users/checkLeaveWithDate`, {
                attendance
              }, config)
            console.log({ leaveResponse });
            if (leaveResponse.data.status === "0" || leaveResponse.data.status === "400") {
              OldAttendanceObj.absent.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
            }
            if (leaveResponse.data.status === "401") {
              OldAttendanceObj.absent.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
            }
            if (leaveResponse.data.status === "200") {
              OldAttendanceObj.leave.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
            }
            if (leaveResponse.data.status === "201") {
              OldAttendanceObj.paidLeave.push(`${attendance.month}/${attendance.day}/${attendance.year}`)
            }
          } else {
            console.log("INVALID_DATE")
          }

          if (attendaceResponse.data.details.totalAttendances.length == index + 1) {
            setAttendanceObj(OldAttendanceObj)
            setState({
              ...state,
              list: attendaceResponse.data.details.totalAttendances,
              isWait: false
            });
          }
        })

      }, []);
  };



  const getDateItem = (activeDateTime, rest) => {
    let { activeStartDate } = rest;
    activeStartDate = (new Date(activeStartDate)).toLocaleDateString()
    let activeStartDateArr = activeStartDate.split("/")
    if (month !== activeStartDateArr[0]) {
      setMonth(activeStartDateArr[0])
    }

    let today = new Date()
    let dateString = (new Date(activeDateTime)).toLocaleDateString()
    let dateArr = dateString.split("/")
    let date = {
      month: dateArr[0],
      day: dateArr[1],
      year: dateArr[2],
    }

    const diffTime = (new Date(activeDateTime)).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



    let newDateString = `${date.month}/${date.day}/${date.year}`;
    if (AttendanceObj.present.includes(newDateString)) {
      return <div className="dot P"></div>
    }
    if (AttendanceObj.absent.includes(newDateString)) {
      return <div className="dot A"></div>
    }
    if (AttendanceObj.leave.includes(newDateString)) {
      return <div className="dot L"></div>
    }
    if (AttendanceObj.paidLeave.includes(newDateString)) {
      return <div className="dot PL"></div>
    }

    console.log({ date });


    if (diffDays < 0) {
      console.log("The date is in the past.");
    } else if (diffDays === 0) {
      console.log("The date is today.");
    } else {
      return <div className="disable"></div>
      console.log("The date is in the future.");
    }

    return <div className="dot NOT"></div>

  }

  const closeAttendance = () => {
    axios
      .post(process.env.REACT_APP_NODE_URL + `/users/closeAttendance`, {}, config)
      .then((attendaceResponse) => {
        console.log(attendaceResponse);
        setState({
          ...state,
          list: attendaceResponse.data.details.totalAttendances,
          isWait: false
        });
      }, []);
  }

  if (state.isWait) {
    return "Loading..."
  }

  return (
    <>
      <div className="agentDetailsAsideBar" heading_title={"Attendance"}>
        <table className="table-responsive">
          <div className="tabs">
            <div className="tabs">
              <h2 className={`${tab == 1 && "active"}`} onClick={() => {
                setTab(1)
                forToday();
              }}>Find By Date</h2>
              <h2 className={`${tab == 2 && "active"}`} onClick={() => {
                setTab(2)
                setState({
                  ...state,
                  list: []
                })
              }}>Find By User</h2>
            </div>
          </div>


          {
            tab == 1 && (
              <>
                <div className="table-responsive">
                  <div className="m-2 flex items-center">
                    <span className="m-2"><ButtonPrimary onclick={forToday} theme="green" title={"Today"} /></span>
                    ||
                    {/* make inputs with day, month and year */}
                    <div className="flex items-center justify-between w-full">
                      <span>
                        <input type="text" id="a" placeholder="Day" className="m-2 rounded border border-current  h-9 p-2" />
                        <input type="text" id="b" placeholder="Month" className="m-2 rounded border border-current  h-9 p-2" />
                        <input type="text" id="c" placeholder="Year" className="m-2 rounded border border-current  h-9 p-2" />
                        <ButtonPrimary title={"Find"} onclick={forDate} />
                      </span>
                      <div className="">
                        <ButtonPrimary title={"Close Timing"} onclick={closeAttendance} theme="danger" />
                      </div>

                    </div>

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
            tab == 3 && (
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

        {
          tab == 2 && <div className="my-calendar">
            <div className="m-2">
              <input type="text" id="userEmail" placeholder="User Email" className="m-2 rounded border border-current  h-9 p-2" />
              <ButtonPrimary title={"Find"} onclick={forUser} />
            </div>
            {state.list.length != 0 && <div className="row flex">
              <div className="flex justify-center items-center mr-4">
                <label htmlFor="" className="mr-3">Present : </label>
                <div className="react-calendar__tile w-2/12">
                  {monthAttendaceObj.present.length}
                  <div className="dot P"></div>
                </div>
              </div>
              <div className="flex justify-center items-center  mr-4">
                <label htmlFor="" className="mr-3">Absent : </label>
                <div className="react-calendar__tile w-2/12">
                  {monthAttendaceObj.absent.length}
                  <div className="dot A"></div>
                </div>
              </div>
              <div className="flex justify-center items-center  mr-4">
                <label htmlFor="" className="mr-3">Leave : </label>
                <div className="react-calendar__tile w-2/12">
                  {monthAttendaceObj.leave.length}
                  <div className="dot L"></div>
                </div>
              </div>
              <div className="flex justify-center items-center mr-4">
                <label htmlFor="" className="mr-3" title="Paid Leave">PL : </label>
                <div className="react-calendar__tile w-2/12">
                  {monthAttendaceObj.paidLeave.length}
                  <div className="dot PL"></div>
                </div>
              </div>
            </div>}
            {state.list.length != 0 && <Calendar onChange={onChange} value={value} tileContent={({ date, ...rest }) => getDateItem(date, rest)} />}
          </div>
        }

      </div>
    </>
  );
};



export default Attendance;
