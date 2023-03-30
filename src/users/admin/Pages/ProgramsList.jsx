import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Switch } from "@mui/material";
import { Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";
import { GrClose } from "react-icons/gr";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

const ProgramsList = (props) => {
  const navigate = useNavigate();
  const [ModalCode, setModalCode] = useState(false);

  const [state, setState] = useState({
    isWaiting: true,
    school_programs: [],
    schoolNamesList: [],
    countryNamesList: [],
    adminToken: getToken("admin"),
    wait: true,
    activeIndex: null,
    first: true,
    searchItem: "",

    totalPages: 0,
    currentPage: 1,
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
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  }, []);

  const getPaginationData = (
    page = 1,
    schoolsList,
    countryList,
    activeCountry = ""
  ) => {
    setState({
      ...state,
      isWaiting: true,
    });
    // var schoolName = state.first
    //   ? id
    //   : document.getElementById("schoolName").value;
    // var country = document.getElementById("country").value;
    // var schoolName = "";
    var country = "";
    var searchItem = state.searchItem;

    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };

    console.log({ country });
    let data = { currentPage: page, searchItem };

    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getprograms", data, config)
      .then((res) => {
        console.log({ programs: res });

        // get country

        // how to get
        // get school detail with school id
        state.first
          ? setState({
              ...state,
              school_programs: res.data.details.totalData,
              schoolNamesList: [],
              countryNamesList: countryList,
              filterCountry: activeCountry,
              // school: res.data.details.school,
              totalPages: res.data.details.totalPages,
              isWaiting: false,
              first: false,
            })
          : setState({
              ...state,
              school_programs: res.data.details.totalData,
              totalPages: res.data.details.totalPages,
              isWaiting: false,
            });
      })
      .catch((err) => {
        console.log({ err });
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
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
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

  const toggleTopStatus = (sId, pId) => {
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = { sId, pId };
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/admin/toggletopstatus",
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

  const [tableColumns, setTableColumns] = useState([
    {
      label: "Sr.",
      value: "Sr.",
    },
    {
      label: "Program Id",
      value: "Program Id",
    },
    {
      label: "Country",
      value: "Country",
    },
    {
      label: "School",
      value: "School",
    },
    {
      label: "Program Name",
      value: "Program Name",
    },
    {
      label: "Description",
      value: "Description",
    },
    {
      label: "Duration",
      value: "Duration",
    },
    // {
    //   label: "Process Days",
    //   value: "Process Days",
    // },
    {
      label: "Visa Processing Days",
      value: "Visa Processing Days",
    },
    {
      label: "Acceptance Letter",
      value: "Acceptance Letter",
    },
    {
      label: "Acceptable Band",
      value: "Acceptable Band",
    },
    {
      label: "Modules",
      value: "Modules",
    },
    {
      label: "Application Fee",
      value: "Application Fee",
    },
    {
      label: "Credentials",
      value: "Credentials",
    },
    {
      label: "Streams",
      value: "Streams",
    },
    {
      label: "Level",
      value: "Level",
    },
    {
      label: "Cost Of Living",
      value: "Cost Of Living",
    },
    {
      label: "Currency",
      value: "Currency",
    },
    {
      label: "Grade Score",
      value: "Grade Score",
    },
    {
      label: "Overall Band",
      value: "Overall Band",
    },
    {
      label: "Pte Score",
      value: "Pte Score",
    },
    {
      label: "Tofel Points",
      value: "Tofel Points",
    },
    {
      label: "English Language",
      value: "English Language",
    },
    {
      label: "Foundation Fee",
      value: "Foundation Fee",
    },
    {
      label: "Tuition Fees",
      value: "Tuition Fees",
    },
    {
      label: "Other Fees",
      value: "Other Fees",
    },
    {
      label: "Other Comment",
      value: "Other Comment",
    },
    {
      label: "Few Seats",
      value: "Few Seats",
    },
    {
      label: "Top Status",
      value: "Top Status",
    },
    {
      label: "Intakes",
      value: "Intakes",
    },
    {
      label: "Actions",
      value: "Actions",
    },
  ]);

  const [selectedColumnsTable, setSelectedColumnsTable] = useState([
    "Sr.",
    "Program Id",
    "School",
    "Program Name",
    "Duration",
    "Few Seats",
    "Top Status",
    "Actions",
  ]);

  let Reset = [
    "Sr.",
    "Program Id",
    "School",
    "Program Name",
    "Duration",
    "Few Seats",
    "Top Status",
    "Actions",
  ];

  const [tempColumnsTable, setTempColumnsTable] = useState([
    "Sr.",
    "School",
    "Program Name",
    "Duration",
    "Few Seats",
    "Top Status",
    "Actions",
  ]);

  return (
    <>
      <div heading_title={"Program List"}>
        <>
          <div className="row min-height-vh-100">
            <div className="row p-45">
              <div className="col-12">
                {/* <div className="schoolFilters">
                  <div className="left">
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
                </div> */}

                <div className="schoolFilters mb-4">
                  <div className="left">
                    <div className="btn_outerxx ml-3">
                      <ButtonPrimary
                        title={"Columns"}
                        onclick={() => setModalCode(!ModalCode)}
                      />
                      {ModalCode ? (
                        <div className="modal_cover">
                          <div className="modal_inner select-col-popup">
                            <div className="header_modal">
                              <h1 className="capitalize font-bold text-lg mb-2">
                                select columns
                              </h1>
                              <p className="border-b pb-2 mb-2">
                                Select the column you want to show or hide in
                                option chain.
                              </p>
                              <div
                                className="columns-popup"
                                style={{ justifyContent: "space-between" }}
                              >
                                {tableColumns.map((column, index) => {
                                  if (
                                    selectedColumnsTable.includes(column.value)
                                  ) {
                                    return (
                                      <p className="mb-0 gap-2">
                                        <input
                                          type="checkbox"
                                          id={column.value}
                                          defaultChecked
                                          onClick={() => {
                                            let index =
                                              selectedColumnsTable.indexOf(
                                                column.value
                                              );
                                            selectedColumnsTable.splice(
                                              index,
                                              1
                                            );
                                            setTempColumnsTable(
                                              selectedColumnsTable
                                            );
                                          }}
                                        />
                                        <label htmlFor={column.value}>
                                          {column.label}
                                        </label>
                                      </p>
                                    );
                                  } else {
                                    return (
                                      <p className="mb-0 gap-2">
                                        <input
                                          type="checkbox"
                                          id={column.value}
                                          onClick={() => {
                                            selectedColumnsTable.push(
                                              column.value
                                            );
                                            setTempColumnsTable(
                                              selectedColumnsTable
                                            );
                                          }}
                                        />
                                        <label htmlFor={column.value}>
                                          {column.label}
                                        </label>
                                      </p>
                                    );
                                  }
                                })}
                              </div>
                              <div className="button-part flex justify-end items-center gap-4">
                                <button
                                  className="py-2 px-6"
                                  type="btn"
                                  onClick={() => {
                                    console.log({ selectedColumnsTable });
                                    setSelectedColumnsTable(Reset);
                                    setModalCode(false);
                                  }}
                                >
                                  Reset all
                                </button>
                                <button
                                  className="py-2 px-6"
                                  type="btn"
                                  onClick={() => {
                                    setSelectedColumnsTable(tempColumnsTable);
                                    setModalCode(false);
                                  }}
                                >
                                  Ok
                                </button>
                              </div>
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
                    </div>
                  </div>
                  <div className="right flex items-center justify-center">
                    <div className="filter-group mr-2">
                      <input
                        className="form-control rounded border-2 border-black p-2"
                        type="text"
                        placeholder="SEARCH"
                        id="searchItem"
                        name="searchItem"
                        onChange={handleChange}
                      />
                    </div>
                    <ButtonPrimary
                      title={"Find"}
                      onclick={() => getPaginationData(1)}
                    />
                  </div>
                </div>
                <div className="card mb-4 mt-2">
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="overflow-auto card shadow-lg m-4 col-12 px-0 pt-0 pb-2  border">
                      <table className="table-auto overflow-scroll w-full agent-table files-table">
                        <thead>
                          <tr>
                            {tableColumns.map((col) => {
                              if (selectedColumnsTable.includes(col.label)) {
                                if (
                                  [
                                    "Actions",
                                    "Top Status",
                                    "Few Seats",
                                  ].includes(col.label)
                                ) {
                                  return (
                                    <th className="p-2 max-width text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center">
                                      {col.label}
                                    </th>
                                  );
                                }
                                return (
                                  <th className="p-2 max-width text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left">
                                    {col.label}
                                  </th>
                                );
                              }
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {state.school_programs.map((school, index) => {
                            return school.school_programs.map(
                              (program, index2) => {
                                return (
                                  <tr>
                                    {selectedColumnsTable.includes("Sr.") && (
                                      <td className="border-2 p-2 max-width">
                                        {index2 + 1}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Program Id"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.program_id}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Country"
                                    ) && (
                                      <td className="border-2 p-2 max-width capitalize">
                                        <b>{school.country}</b>
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "School"
                                    ) && (
                                      <td className="border-2 p-2 max-width capitalize">
                                        <b>{school.school_name}</b>
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Program Name"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        <b>{program.program_name}</b>
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Description"
                                    ) && (
                                      <td className="border-2 p-2 max-width max-two-line">
                                        {program.description}
                                      </td>
                                    )}

                                    {/* <td className="border-2 p-2 text-center">{program.intake_id}</td> */}
                                    {selectedColumnsTable.includes(
                                      "Duration"
                                    ) && (
                                      <td className="border-2 p-2">
                                        {program.duration} Years{" "}
                                        {program?.duration_sem_per_year &&
                                          `(${program?.duration_sem_per_year} Sem)`}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Visa Processing Days"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.visa_processing_days}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Acceptance Letter"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.acceptance_letter}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Acceptable Band"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.acceptable_band}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Modules"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.module}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Application Fee"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.application_fee}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Credentials"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program?.credentials || "--"}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Streams"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program?.new_stream[0]
                                          ? program.new_stream.join(" ")
                                          : "-"}
                                      </td>
                                    )}

                                    {selectedColumnsTable.includes("Level") && (
                                      <td className="border-2 p-2 max-width">
                                        {program.program_level.join(" ")}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Cost Of Living"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.cost_of_living}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Currency"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.currency}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Grade Score"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.grade_score}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Overall Band"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.overall_band}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Pte Score"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.pte_score}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Tofel Points"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.tofel_point}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "English Language"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.english_language}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Foundation Fee"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.foundation_fee}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Tuition Fees"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.max_tution_fee} -{" "}
                                        {program.min_tution_fee_per_semester}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Other Fees"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.other_fees}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Other Comment"
                                    ) && (
                                      <td className="border-2 p-2 max-width">
                                        {program.other_comment}
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Few Seats"
                                    ) && (
                                      <td className="border-2 p-2 text-center">
                                        {program.few_seats_status ? (
                                          <Switch
                                            color="primary"
                                            defaultChecked={true}
                                            onChange={(e) => {
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
                                            onChange={(e) => {
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
                                    )}

                                    {selectedColumnsTable.includes(
                                      "Top Status"
                                    ) && (
                                      <td className="border-2 p-2 text-center">
                                        {Boolean(program.top_status) !=
                                        false ? (
                                          <Switch
                                            color="primary"
                                            defaultChecked
                                            onClick={(e) => {
                                              if (
                                                window.confirm("Are you sure ?")
                                              ) {
                                                toggleTopStatus(
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
                                                toggleTopStatus(
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
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Intakes"
                                    ) && (
                                      <td className="border-2 p-2 text-center">
                                        <button
                                          onClick={() =>
                                            navigate(
                                              `/d/admin/intakes_program?schoolId=${school._id}&programId=${program.program_id}`
                                            )
                                          }
                                          className="px-4 py-2 border-2 rounded bg-[green] text-white capitalize"
                                        >
                                          Intakes
                                        </button>
                                      </td>
                                    )}
                                    {selectedColumnsTable.includes(
                                      "Actions"
                                    ) && (
                                      <td className="p-1 border-2 text-center">
                                        <div className="action-icons-list">
                                          <svg
                                            className="action-icon"
                                            onClick={() =>
                                              navigate(
                                                `/d/admin/programupdate/${school._id}/${program.program_id}`
                                              )
                                            }
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                          >
                                            {/*! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                          </svg>

                                          {/*
                                      <svg
                                        className="action-icon"
                                        onClick={() =>
                                          navigate(
                                            "/d/admin/school-details?id=" +
                                              school._id
                                          )
                                        }
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                      </svg> */}
                                        </div>
                                      </td>
                                    )}
                                    {/* <td className="border-2 p-2 text-center statusCell">
                                                                        <span className={`${state.activeIndex == index2 ? "active" : ""} p-2 border rounded`} onClick={() => toggleActiveIndex(index2)}>Status</span>
                                                                        <div className={`${state.activeIndex == index2 ? "statusBox active" : "statusBox"}`}>
                                                                            <ul>
                                                                                {
                                                                                    program.status.split(",").map((status, index4) => {
                                                                                        if (status == "1") {
                                                                                            return <li onClick={(e) => {
                                                                                                if (window.confirm("Are you sure ?")) {
                                                                                                    changeProgramIntakeStatus(school._id, program.program_name, index4)
                                                                                                } else {
                                                                                                    e.preventDefault();
                                                                                                    e.stopPropagation();
                                                                                                    return false;
                                                                                                }
                                                                                            }} className={`${index4 + 1 == program.status.split(",").length ? "border-bottom-0" : ""}`}><span>{monthsArray[parseInt(program.intake_id.split(",")[index4]) - 1]}</span><span> <Switch color="primary" defaultChecked onClick={() => null} /> </span></li>
                                                                                        } else {
                                                                                            return <li onClick={(e) => {
                                                                                                if (window.confirm("Are you sure ?")) {
                                                                                                    changeProgramIntakeStatus(school._id, program.program_name, index4)
                                                                                                } else {
                                                                                                    e.preventDefault();
                                                                                                    e.stopPropagation();
                                                                                                    return false;
                                                                                                }
                                                                                            }}
                                                                                                classname={`${index4 + 1 == program.status.split(",").length ? "border-bottom-0" : ""}`}><span>{monthsArray[parseInt(program.intake_id.split(",")[index4]) - 1]}</span><span><Switch color="primary" onClick={() => null} /> </span></li>
                                                                                        }
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </td> */}
                                    {/* <td className="border-2 p-2 align-middle d-flex"> */}
                                    {/* <div className="tableIcons">
                                                                                    <i className="fa fa-edit"></i>
                                                                                </div> */}
                                    {/* <div className="tableIcons">
                                                                            <i class="fa-solid fa-trash-can"></i>
                                                                        </div> */}
                                    {/* <a href="javascript:;" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                                                        Programs
                                                                    </a> */}
                                    {/* </td> */}
                                  </tr>
                                );
                              }
                            );
                          })}
                        </tbody>
                      </table>
                      {state.isWaiting ? (
                        <div>
                          <center className="w-full my-10">
                            <img
                              width={100}
                              src="https://i.gifer.com/ZZ5H.gif"
                              alt=""
                            />
                          </center>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {/* pagination is here */}
                </div>
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
          </div>
        </>
      </div>
    </>
  );
};

export default ProgramsList;
