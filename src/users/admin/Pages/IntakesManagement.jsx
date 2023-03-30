import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Switch } from "@mui/material";
import { Navigate, redirect, useParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const IntakesManagement = (props) => {
  // const id = null;
  const queryParameters = new URLSearchParams(window.location.search);

  const [state, setState] = useState({
    isWaiting: true,
    school_programs: [],
    schoolNamesList: [],
    countryNameList: [],
    adminToken: getToken("admin"),
    totalPages: 0,
    currentPage: 1,
    activeIndex: null,
    first: true,

    // new
    intakesData: [],
    countryId: queryParameters.get("countryId") || null,
    stateId: null,
    cityId: null,
    schoolId: queryParameters.get("schoolId") || "",
    programId: queryParameters.get("programId") || "",
    findStatus: false,

    schoolName: "",
    programName: "",
  });

  // useEffect(() => {
  //     setState({
  //         ...state,
  //         isWaiting: true,
  //     })
  //     if (window.location.href.split("/").pop() == "intakes") {
  //         axios.post(process.env.REACT_APP_NODE_URL + "/admin/getschoolnameidandcountrieslist", { schoolId: null }).then(res => {
  //             console.log({ responseSchools: res })
  //             // getPaginationData(1, res.data.schoolNamesList, res.data.countryNameList, res.data.activeCountry)

  //             setState({
  //                 ...state,
  //                 countryNameList: res.data.countryNameList,
  //                 isWaiting: false,
  //                 findStatus: false,
  //                 intakesData: [],
  //                 countryId: null,
  //                 schoolId: null,
  //                 programId: null,
  //                 schoolName: "",
  //                 programName: ""
  //             })

  //         }).catch(err => {
  //             console.log(err.response.data)
  //             // alert(err.response.data.message)
  //         })
  //     } else {
  //         axios.post(process.env.REACT_APP_NODE_URL + "/admin/getschoolnameidandcountrieslist", { schoolId: state.schoolId }).then(res => {
  //             console.log({ responseSchools: res })
  //             // getPaginationData(1, res.data.schoolNamesList, res.data.countryNameList, res.data.activeCountry)

  //             let data = {
  //                 countryId: state.countryId,
  //                 schoolId: state.schoolId,
  //                 programId: state.programId,
  //             }

  //             axios.post(process.env.REACT_APP_NODE_URL + "/admin/findintakes", data).then(res2 => {
  //                 console.log({ responseSchools2: res })
  //                 setState({
  //                     ...state,
  //                     intakesData: res2.data.details.globalIntake,
  //                     countryNameList: res.data.countryNameList,
  //                     isWaiting: false,
  //                     findStatus: true,

  //                     schoolName: res2.data.details.meta_data.schoolName,
  //                     programName: res2.data.details.meta_data.programName,
  //                 })
  //             }).catch(err => {
  //                 console.log(err.response.data)
  //             })

  //         }).catch(err => {
  //             console.log(err.response.data)
  //             // alert(err.response.data.message)
  //         })
  //     }
  // }, [window.location.href])

  useEffect(() => {
    axios
      .post(
        process.env.REACT_APP_NODE_URL +
          "/admin/getschoolnameidandcountrieslist",
        { schoolId: null }
      )
      .then((res) => {
        console.log({ responseSchools: res });
        // getPaginationData(1, res.data.schoolNamesList, res.data.countryNameList, res.data.activeCountry)

        let data = {
          countryId: state.countryId,
          schoolId: state.schoolId,
          programId: state.programId,
        };

        setState({
          ...state,
          countryNameList: res.data.countryNameList,
          isWaiting: false,
          findStatus: true,
        });

        // axios.post(process.env.REACT_APP_NODE_URL + "/admin/findintakes", data).then(res2 => {
        //     console.log({ responseSchools2: res2 })
        //     setState({
        //         ...state,
        //         intakesData: res2.data.details.globalIntake,
        //         countryNameList: res.data.countryNameList,
        //         schoolNamesList: [],
        //         isWaiting: false,
        //         findStatus: true,

        //         schoolName: res2.data.details.meta_data.schoolName,
        //         programName: res2.data.details.meta_data.programName,
        //     })
        // }).catch(err => {
        //     console.log(err.response.data)
        // })
      })
      .catch((err) => {
        console.log(err.response.data);

        setState({
          ...state,
          isWaiting: false,
        });
        // alert(err.response.data.message)
      });
  }, []);

  // const getPaginationData = (page, schoolsList, countryList, activeCountry = "") => {
  //     setState({
  //         ...state,
  //         isWaiting: true,
  //     })
  //     var schoolName = state.first ? id : document.getElementById("schoolName").value;
  //     var country = document.getElementById("country").value;
  //     var searchItem = document.getElementById("searchItem").value;
  //     const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }

  //     console.log({ schoolName })
  //     console.log({ country })
  //     let data = { currentPage: page, schoolName, country, searchItem }
  //     axios.post(process.env.REACT_APP_NODE_URL + "/admin/getprograms", data, config).then(res => {
  //         console.log({ res })

  //         // get country

  //         // how to get
  //         // get school detail with school id
  //         state.first ?

  //             setState({
  //                 ...state,
  //                 school_programs: res.data.details.totalData,
  //                 schoolNamesList: schoolsList,
  //                 countryNamesList: countryList,
  //                 filterCountry: activeCountry,
  //                 // school: res.data.details.school,
  //                 // totalPages: res.data.details.totalPages,
  //                 // currentPage: res.data.details.currentPage,
  //                 isWaiting: false,
  //                 first: false,
  //             })
  //             :
  //             setState({
  //                 ...state,
  //                 school_programs: res.data.details.totalData,
  //                 isWaiting: false,
  //             })

  //     }).catch(err => {
  //         console.log(err.response.data)
  //         // alert(err.response.data.message)
  //     })
  // }

  const toggleActiveIndex = (index) => {
    setState({
      ...state,
      activeIndex: index == state.activeIndex ? null : index,
    });
  };

  const areYouConfirm = () => window.confirm("Are you confirm ?");

  const addYear = () => {
    if (!areYouConfirm()) return;
    if (state.intakesData.length == 0) {
      setState({
        ...state,
        intakesData: [
          {
            year: 2023,
            months: [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ],
          },
        ],
      });
      return;
    }
    let oldYears = state.intakesData;
    let lastYear = parseInt(oldYears[oldYears.length - 1].year);
    oldYears.push({
      year: lastYear + 1,
      months: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    });
    setState({
      ...state,
      intakesData: oldYears,
    });
  };

  const removeYear = (index) => {
    if (state.intakesData.length == 1)
      return alert("Atleast one year is required");
    if (!areYouConfirm()) return;

    let oldYears = state.intakesData;
    oldYears.splice(index, 1);
    setState({
      ...state,
      intakesData: oldYears,
    });
  };

  const monthsArray = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const changeProgramIntakeStatus = (sId, pId, index) => {
  //     const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
  //     let data = { sId, pId, index }
  //     axios.post(process.env.REACT_APP_NODE_URL + "/admin/toggleIntakeStatus", data, config).then(res => {
  //         console.log({ res })
  //     }).catch(err => {
  //         console.log(err.response.data)
  //         // alert(err.response.data.message)
  //     })
  // }

  const handleChange = (e) => {
    if (e.target.name == "countryId") {
      // get School List
      getSchoolNames(e.target.value, state.stateId, state.cityId);
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
    // getPaginationData(1, state.schoolNamesList, state.countryList)
  };

  const getSchoolNames = (countryId, stateId, cityId) => {
    let data = { countryId, stateId, cityId };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getschoolnames", data)
      .then((res) => {
        setState({
          ...state,
          schoolNamesList: res.data.schoolNamesList,
          countryId,
          stateId: "",
          cityId: "",
          schoolId: "",
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };

  // const toggleFewSeatsStatus = (sId, pId) => {
  //     const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
  //     let data = { sId, pId }
  //     axios.post(process.env.REACT_APP_NODE_URL + "/admin/togglefewseatsstatus", data, config).then(res => {
  //         console.log({ res })
  //     }).catch(err => {
  //         console.log(err.response.data)
  //         // alert(err.response.data.message)
  //     })
  // }

  const toggleStatus = (yearIndex, monthIndex) => {
    let oldIntakesData = state.intakesData;
    oldIntakesData[yearIndex].months[monthIndex] =
      !oldIntakesData[yearIndex].months[monthIndex];
    setState({
      ...state,
      intakesData: oldIntakesData,
    });
  };

  const submitIntakesData = () => {
    if (!window.confirm("Are you sure ?")) {
      return;
    }
    let data = {
      countryId: state.countryId,
      schoolId: state.schoolId,
      programId: state.programId,
      intakesData: state.intakesData,
    };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/updateintakes", data)
      .then((res) => {
        console.log({ updateresponse: res });
        alert(res.data.message);
        // setState({
        //     ...state,
        //     findStatus: true,
        //     intakesData: res.data.details.globalIntake
        // })
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const findIntakes = () => {
    setState({
      ...state,
      isWaiting: true,
    });
    let data = {
      countryId: state.countryId,
      schoolId: state.schoolId,
      programId: state.programId,
    };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/findintakes", data)
      .then((res) => {
        console.log({ responseSchools2: res });
        setState({
          ...state,
          findStatus: true,
          isWaiting: false,
          intakesData: res.data.details.globalIntake,
        });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <>
      <div heading_title={"Program List"}>
        <>
          <div className="row min-height-vh-100">
            <div className="row p-45">
              <div className="col-12">
                {state.schoolName != "" && state.programName != "" ? (
                  <div className="capitalize font-bold my-4 border p-2 bg-[#2a276b] text-white">
                    {state.schoolName} - {state.programName}
                  </div>
                ) : (
                  <div className="schoolFilters">
                    <div className="left">
                      <div className="filter-group w-4/12">
                        <label htmlFor="" className="">
                          Country
                        </label>
                        <select
                          className="form-control p-2 border-2 border-black uppercase mr-2"
                          name="countryId"
                          id="countryId"
                          onChange={handleChange}
                        >
                          <option value="">All</option>
                          {state.countryNameList.map((country) => {
                            if (state.countryId == country.countryId)
                              return (
                                <option
                                  className="uppercase"
                                  value={country.countryId}
                                  selected
                                >
                                  {country.countryName}
                                </option>
                              );
                            else
                              return (
                                <option
                                  className="uppercase"
                                  value={country.countryId}
                                >
                                  {country.countryName}
                                </option>
                              );
                          })}
                        </select>
                      </div>
                      <div className="filter-group col-3">
                        <label htmlFor="" className="">
                          School
                        </label>
                        <select
                          className="rounded form-control p-2 border-2 border-black uppercase"
                          name="schoolId"
                          id="schoolId"
                          onChange={handleChange}
                          value={state.schoolId}
                        >
                          <option value="">All</option>
                          {state.schoolNamesList.map((school) => {
                            return (
                              <option
                                className="uppercase"
                                value={school.schoolName}
                              >
                                {school.schoolName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <button
                        onClick={findIntakes}
                        className="mt-[25px] duration-100 rounded px-4 py-2 bg-[#2a276b] text-white m-2 hover:bg-[black] flex items-center justify-center"
                      >
                        Find
                      </button>
                      {/* <div className="filter-group col-3 ml-2">
                                                            <select className="form-control rounded p-2 border-2 border-black uppercase" name="school" defaultValue={id} id="schoolName" onChange={handleChange}>
                                                                <option value="">-- Select Program --</option>
                                                                <option value="">All</option>
                                                                {
                                                                    state.schoolNamesList.map(school => {
                                                                        if (id == school._id)
                                                                            return <option className="uppercase" value={school._id} selected>{school.school_name}</option>
                                                                        else
                                                                            return <option className="uppercase" value={school._id}>{school.school_name}</option>
                                                                    })
                                                                }
                                                            </select>
                                                        </div> */}
                    </div>
                    {/* <div className="right">
                                                        <div className="filter-group">
                                                            <input className="form-control p-2 border-2 border-black" type="text" placeholder="SEARCH" id="searchItem" name="searchItem" onChange={handleChange} />
                                                        </div>
                                                    </div> */}
                  </div>
                )}

                {state.findStatus != true ? (
                  <></>
                ) : (
                  <div className="card mb-4 mt-2">
                    <div className="card-body px-0 pt-0 pb-2">
                      <table className="table table-responsive agent-table intakestable w-full">
                        <thead>
                          <tr>
                            <th>
                              <span className="month">Year</span>/
                              <span className="year">Month</span>
                            </th>
                            {monthsArray.map((month) => {
                              return <th>{month}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {state.intakesData.map(
                            (yearAndMonths, parentIndex) => {
                              return (
                                <tr>
                                  <td className="col">
                                    {state.intakesData.length != 1 && (
                                      <span
                                        className="deleteYear"
                                        onClick={() => removeYear(parentIndex)}
                                      >
                                        X
                                      </span>
                                    )}
                                    <p>{yearAndMonths.year}</p>
                                  </td>
                                  {yearAndMonths.months.map(
                                    (month, monthIndex) => {
                                      return (
                                        <td
                                          onClick={() =>
                                            toggleStatus(
                                              parentIndex,
                                              monthIndex
                                            )
                                          }
                                          className={"cursor-pointer"}
                                        >
                                          {month != false ? (
                                            <i
                                              className={`fa-solid fa-square-check intakeStatus active`}
                                            />
                                          ) : (
                                            <i
                                              className={`fa-solid fa-xmark intakeStatus deactive`}
                                            />
                                          )}
                                        </td>
                                      );
                                    }
                                  )}
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                      <div className="w-full flex items-center justify-between">
                        <button
                          onClick={addYear}
                          className="duration-100 px-4 py-2 bg-[#2a276b] text-white my-2 rounded h-[40px] hover:bg-[black] flex items-center justify-center"
                        >
                          <span>Year +</span>
                        </button>
                        <button
                          onClick={submitIntakesData}
                          className="duration-100 rounded px-4 py-2 bg-[#2a276b] text-white m-2 hover:bg-[black] flex items-center justify-center"
                        >
                          Save
                        </button>
                      </div>
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
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default IntakesManagement;
