import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Switch } from "@mui/material";
import { Navigate, redirect, useParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const ProgramsList = (props) => {
  const [state, setState] = useState({
    isWaiting: true,
    school_programs: [],
    schoolNamesList: [],
    countryNamesList: [],
    adminToken: getToken("admin"),
    totalPages: 0,
    currentPage: 1,
    wait: true,
    activeIndex: null,
    first: true,
  });
  const { id } = useParams();

  useEffect(() => {
    // get school name and id list
    axios
      .post(
        process.env.REACT_APP_NODE_URL +
          "/admin/getschoolnameidandcountrieslist",
        { schoolId: id }
      )
      .then((res) => {
        console.log({ responseSchools: res });
        getPaginationData(
          1,
          res.data.schoolNamesList,
          res.data.countryNameList,
          res.data.activeCountry
        );
        setState({
          ...state,
          isWaiting: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  }, []);

  const getPaginationData = (
    page,
    schoolsList,
    countryList,
    activeCountry = ""
  ) => {
    setState({
      ...state,
      isWaiting: true,
    });
    var schoolName = state.first
      ? id
      : document.getElementById("schoolName").value;
    var country = document.getElementById("country").value;
    var searchItem = document.getElementById("searchItem").value;
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };

    console.log({ schoolName });
    console.log({ country });
    let data = { currentPage: page, schoolName, country, searchItem };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getprograms", data, config)
      .then((res) => {
        console.log({ res });

        // get country

        // how to get
        // get school detail with school id
        state.first
          ? setState({
              ...state,
              school_programs: res.data.details.totalData,
              schoolNamesList: schoolsList,
              countryNamesList: countryList,
              filterCountry: activeCountry,
              // school: res.data.details.school,
              // totalPages: res.data.details.totalPages,
              // currentPage: res.data.details.currentPage,
              isWaiting: false,
              first: false,
            })
          : setState({
              ...state,
              school_programs: res.data.details.totalData,
              isWaiting: false,
            });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };

  const toggleActiveIndex = (index) => {
    setState({
      ...state,
      activeIndex: index == state.activeIndex ? null : index,
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

  const changeProgramIntakeStatus = (sId, pId, index) => {
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = { sId, pId, index };
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/admin/toggleIntakeStatus",
        data,
        config
      )
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };

  const handleChange = (e) => {
    getPaginationData(1, state.schoolNamesList, state.countryList);
  };

  const toggleFewSeatsStatus = (sId, pId) => {
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = { sId, pId };
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/admin/togglefewseatsstatus",
        data,
        config
      )
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };

  return (
    <>
      <div heading_title={"Program List"}>
        <>
          <div className="row min-height-vh-100">
            <div className="row p-45">
              <div className="col-12">
                <div className="schoolFilters">
                  <div className="left">
                    <div className="filter-group w-4/12">
                      <select
                        className="form-control p-2 border-2 border-black uppercase mr-2"
                        name="country"
                        id="country"
                        onChange={handleChange}
                      >
                        <option value="">-- Select Country --</option>
                        <option value="">All</option>
                        {state.countryNamesList.map((country) => {
                          if (state.filterCountry == country.countryName)
                            return (
                              <option
                                className="uppercase"
                                value={country.countryName}
                                selected
                              >
                                {country.countryName}
                              </option>
                            );
                          else
                            return (
                              <option
                                className="uppercase"
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            );
                        })}
                      </select>
                    </div>
                    <div className="filter-group col-3">
                      <select
                        className="form-control p-2 border-2 border-black uppercase"
                        name="schoolName"
                        defaultValue={id}
                        id="schoolName"
                        onChange={handleChange}
                      >
                        <option value="">-- Select School --</option>
                        <option value="">All</option>
                        {state.schoolNamesList.map((school) => {
                          if (id == school._id)
                            return (
                              <option
                                className="uppercase"
                                value={school._id}
                                selected
                              >
                                {school.school_name}
                              </option>
                            );
                          else
                            return (
                              <option className="uppercase" value={school._id}>
                                {school.school_name}
                              </option>
                            );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="right">
                    <div className="filter-group">
                      <input
                        className="form-control p-2 border-2 border-black"
                        type="text"
                        placeholder="SEARCH"
                        id="searchItem"
                        name="searchItem"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="card mb-4 mt-2">
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table mb-0 w-full agent-table">
                        <thead>
                          <tr>
                            <th className="border-2 border-black text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Sr.
                            </th>
                            <th className="border-2 border-black p-2 text-left text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Program
                            </th>
                            <th className="border-2 border-black p-2 text-left align-middle text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Intakes
                            </th>
                            <th className="border-2 border-black p-2 text-left align-middle text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Duration
                            </th>
                            <th className="border-2 border-black p-2 text-left align-middle text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Few Seats
                            </th>
                            <th className="border-2 border-black p-2 text-left align-middle text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Intake Status
                            </th>
                            {/* <th className="p-2 align-middle text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Registred</th> */}
                            <th className="text-secondary opacity-7" />
                          </tr>
                        </thead>
                        <tbody>
                          {!state.isWaiting &&
                            state.school_programs.map((school, index) => {
                              return school.school_programs.map(
                                (program, index2) => {
                                  return (
                                    <tr>
                                      <td className="border-2 p-2 max-width">
                                        {index2 + 1}
                                      </td>
                                      <td className="border-2 p-2 max-width">
                                        <div className="">
                                          <div>
                                            <b>{program.program_name}</b>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="border-2 p-2 text-center">
                                        {program.intake_id}
                                      </td>
                                      <td className="border-2 p-2 text-center">
                                        {program.duration} Sem
                                      </td>
                                      <td className="border-2 p-2 text-center">
                                        {program.few_seats_status ? (
                                          <Switch
                                            color="primary"
                                            defaultChecked
                                            onClick={(e) => {
                                              if (
                                                window.confirm("Are you sure ?")
                                              ) {
                                                toggleFewSeatsStatus(
                                                  school._id,
                                                  program.program_name
                                                );
                                              } else {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                return false;
                                              }
                                            }}
                                          />
                                        ) : (
                                          <Switch
                                            color="primary"
                                            onClick={(e) => {
                                              if (
                                                window.confirm("Are you sure ?")
                                              ) {
                                                toggleFewSeatsStatus(
                                                  school._id,
                                                  program.program_name
                                                );
                                              } else {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                return false;
                                              }
                                            }}
                                          />
                                        )}
                                      </td>
                                      <td className="border-2 p-2 text-center statusCell">
                                        <span
                                          className={`${
                                            state.activeIndex == index2
                                              ? "active"
                                              : ""
                                          } p-2 border rounded`}
                                          onClick={() =>
                                            toggleActiveIndex(index2)
                                          }
                                        >
                                          Status
                                        </span>
                                        <div
                                          className={`${
                                            state.activeIndex == index2
                                              ? "statusBox active"
                                              : "statusBox"
                                          }`}
                                        >
                                          <ul>
                                            {program.status
                                              .split(",")
                                              .map((status, index4) => {
                                                if (status == "1") {
                                                  return (
                                                    <li
                                                      onClick={(e) => {
                                                        if (
                                                          window.confirm(
                                                            "Are you sure ?"
                                                          )
                                                        ) {
                                                          changeProgramIntakeStatus(
                                                            school._id,
                                                            program.program_name,
                                                            index4
                                                          );
                                                        } else {
                                                          e.preventDefault();
                                                          e.stopPropagation();
                                                          return false;
                                                        }
                                                      }}
                                                      className={`${
                                                        index4 + 1 ==
                                                        program.status.split(
                                                          ","
                                                        ).length
                                                          ? "border-bottom-0"
                                                          : ""
                                                      }`}
                                                    >
                                                      <span>
                                                        {
                                                          monthsArray[
                                                            parseInt(
                                                              program.intake_id.split(
                                                                ","
                                                              )[index4]
                                                            ) - 1
                                                          ]
                                                        }
                                                      </span>
                                                      <span>
                                                        {" "}
                                                        <Switch
                                                          color="primary"
                                                          defaultChecked
                                                          onClick={() => null}
                                                        />{" "}
                                                      </span>
                                                    </li>
                                                  );
                                                } else {
                                                  return (
                                                    <li
                                                      onClick={(e) => {
                                                        if (
                                                          window.confirm(
                                                            "Are you sure ?"
                                                          )
                                                        ) {
                                                          changeProgramIntakeStatus(
                                                            school._id,
                                                            program.program_name,
                                                            index4
                                                          );
                                                        } else {
                                                          e.preventDefault();
                                                          e.stopPropagation();
                                                          return false;
                                                        }
                                                      }}
                                                      classname={`${
                                                        index4 + 1 ==
                                                        program.status.split(
                                                          ","
                                                        ).length
                                                          ? "border-bottom-0"
                                                          : ""
                                                      }`}
                                                    >
                                                      <span>
                                                        {
                                                          monthsArray[
                                                            parseInt(
                                                              program.intake_id.split(
                                                                ","
                                                              )[index4]
                                                            ) - 1
                                                          ]
                                                        }
                                                      </span>
                                                      <span>
                                                        <Switch
                                                          color="primary"
                                                          onClick={() => null}
                                                        />{" "}
                                                      </span>
                                                    </li>
                                                  );
                                                }
                                              })}
                                          </ul>
                                        </div>
                                      </td>
                                      {/* <td className="border-2 p-2 align-middle d-flex"> */}
                                      {/* <div className="tableIcons">
                                                                                    <i className="fa fa-edit"></i>
                                                                                </div> */}
                                      {/* <div className="tableIcons">
                                                                            <i class="fa-solid fa-trash-can"></i>
                                                                        </div> */}
                                      {/* <a href="javascript:;" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                                                        <b>Programs</b>
                                                                    </a> */}
                                      {/* </td> */}
                                    </tr>
                                  );
                                }
                              );
                            })}
                        </tbody>
                      </table>
                      {!state.isWaiting && state.school_programs.length == 0 ? (
                        <div className="text-[red] w-full text-center mt-[50px]">
                          No Program Found
                        </div>
                      ) : (
                        <></>
                      )}
                      {state.isWaiting && (
                        <div className="text-[red] w-full text-center mt-[50px]">
                          Loading...
                        </div>
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

export default ProgramsList;
