import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";
import { MultiSelect } from "react-multi-select-component";
import { Switch } from "@mui/material";
import { GrClose } from "react-icons/gr";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

import DropdownPrimary from "../../../common/Dropdown/dropdown";
const SchoolList = () => {
  const [ModalCode, setModalCode] = useState(false);
  const [ModalCodeFilter, setModalCodeFilter] = useState(false);
  const [state, setState] = useState({
    isWaiting: true,
    isFilterLoading: false,
    schools: [],
    schoolNamesList: [],
    adminToken: getToken("admin"),
    totalPages: 0,
    currentPage: 1,
    country: "",
    searchItem: "",
    first: true,
    baseUrl: "",

    countryNamesList: [],
    stateNamesList: [],
    cityNamesList: [],

    // new filters
    filter_type: "",
    filter_total_students_min: "",
    filter_total_students_max: "",
    filter_international_students_min: "",
    filter_international_students_max: "",
    filter_founded_year_min: "",
    filter_founded_year_max: "",
    filter_accomodation_features: "",
    filter_work_permit_feature: "",
    filter_work_while_study: "",
    filter_program_cooporation: "",
    filter_condition_offer_letter: "",
    filter_top_status: "",
    filter_library: "",
    countryId: "",
    stateId: "",
    cityId: "",
  });

  const [tableColumns, setTableColumns] = useState([
    {
      label: "Sr.",
      value: "Sr.",
    },
    {
      label: "Country Logo",
      value: "Country Logo",
    },
    {
      label: "School Logo",
      value: "School Logo",
    },
    {
      label: "School Name",
      value: "School Name",
    },
    {
      label: "Country",
      value: "Country",
    },
    {
      label: "State",
      value: "State",
    },
    {
      label: "City",
      value: "City",
    },
    {
      label: "Total Programs",
      value: "Total Programs",
    },
    {
      label: "Type",
      value: "Type",
    },
    {
      label: "Total Students",
      value: "Total Students",
    },
    {
      label: "Founded",
      value: "Founded",
    },
    {
      label: "Top Status",
      value: "Top Status",
    },

    {
      label: "Actions",
      value: "Actions",
    },
  ]);

  const [selectedColumnsTable, setSelectedColumnsTable] = useState([
    "Sr.",
    "Country Logo",
    "School Logo",
    "School Name",
    "Country",
    "Total Programs",
    "Top Status",
    "Actions",
  ]);

  let Reset = [
    "Sr.",
    "Country Logo",
    "School Logo",
    "School Name",
    "Country",
    "Total Programs",
    "Top Status",
    "Actions",
  ];

  const [tempColumnsTable, setTempColumnsTable] = useState([
    "Sr.",
    "Country Logo",
    "School Logo",
    "School Name",
    "Country",
    "Total Programs",
    "Top Status",
    "Actions",
  ]);

  const navigate = useNavigate();
  useEffect(() => {
    // get school name and id list
    axios
      .post(
        process.env.REACT_APP_NODE_URL +
          "/admin/getschoolnameidandcountrieslist",
        {}
      )
      .then((res) => {
        console.log({ responseSchools: res });
        getPaginationData(
          1,
          res.data.schoolNamesList,
          res.data.countryNameList,
          res.data.cityNameList,
          res.data.stateNameList
        );
      })
      .catch((err) => {
        setState({
          ...state,
          isWaiting: false,
        });
        console.log(err);
        // alert(err.response.data.message)
      });
  }, []);

  const getPaginationData = (
    page,
    schoolsList,
    countryList,
    cityList,
    stateList,
    isFilterClose
  ) => {
    setState({
      ...state,
      isWaiting: true,
    });

    console.log({ state });

    // let countryId = document.getElementById("countryId")?.value || "";
    // let stateId = document.getElementById("stateId")?.value || "";
    // let cityId = document.getElementById("cityId")?.value || "";
    // let searchItem = document.getElementById("searchItem")?.value || "";

    let api_data = {
      currentPage: page,
      countryId: parseInt(state.countryId) || "",
      stateId: parseInt(state.stateId) || "",
      cityId: parseInt(state.cityId) || "",
      filter_type: state.filter_type,
      filter_total_students: {
        min: parseFloat(state.filter_total_students_min) || "",
        max: parseFloat(state.filter_total_students_max) || "",
      },
      filter_international_students: {
        min: parseFloat(state.filter_international_students_min) || "",
        max: parseFloat(state.filter_international_students_max) || "",
      },
      filter_accomodation_features:
        state.filter_accomodation_features == ""
          ? ""
          : state.filter_accomodation_features === "true",
      filter_work_permit_feature:
        state.filter_work_permit_feature == ""
          ? ""
          : state.filter_work_permit_feature === "true",
      filter_program_cooporation:
        state.filter_program_cooporation == ""
          ? ""
          : state.filter_program_cooporation === "true",
      filter_work_while_study:
        state.filter_work_while_study == ""
          ? ""
          : state.filter_work_while_study === "true",
      filter_condition_offer_letter:
        state.filter_condition_offer_letter == ""
          ? ""
          : state.filter_condition_offer_letter === "true",
      filter_library:
        state.filter_library == "" ? "" : state.filter_library === "true",
      filter_founded: {
        min: parseInt(state.filter_founded_year_min) || "",
        max: parseInt(state.filter_founded_year_max) || "",
      },
      filter_top_status:
        state.filter_top_status == "" ? "" : state.filter_top_status === "true",
      searchItem: state?.searchItem || "",
    };

    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = api_data;
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getschools", data, config)
      .then((res) => {
        if (isFilterClose == true) {
          setModalCodeFilter(false);
        }
        console.log({ res });
        state.first
          ? setState({
              ...state,
              schools: res.data.details.schools,
              totalPages: res.data.details.totalPages,
              currentPage: res.data.details.currentPage,
              schoolNamesList: schoolsList,
              countryNamesList: countryList,
              cityNamesList: cityList,
              stateNamesList: stateList,
              isWaiting: false,
              first: false,
              baseUrl: res.data.details.baseUrl,
            })
          : setState({
              ...state,
              schools: res.data.details.schools,
              totalPages: res.data.details.totalPages,
              currentPage: res.data.details.currentPage,
              isWaiting: false,
            });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };

  const handleChange = (e) => {
    if (e.target.name == "countryId") {
      getStates(e.target.value);
    } else if (e.target.name == "stateId") {
      getCities(e.target.value);
    } else {
      // getPaginationData(1)
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
  };

  const getStates = (countryId) => {
    if (countryId == "") {
      setState({
        ...state,
        stateNamesList: [],
        cityNamesList: [],
      });
      return;
    }
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/state/" + countryId)
      .then((stateResponse) => {
        console.log({ stateResponse });
        if (stateResponse.data.status == "1") {
          setState({
            ...state,
            countryId,
            stateNamesList: stateResponse.data.details.state,
          });
        }
      });
  };

  const getCities = (stateId) => {
    if (stateId == "") {
      setState({
        ...state,
        cityNamesList: [],
      });
      return;
    }
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/city/" + stateId)
      .then((cityResponse) => {
        console.log({ cityResponse });
        if (cityResponse.data.status == "1") {
          setState({
            ...state,
            stateId,
            cityNamesList: cityResponse.data.details.city,
          });
        }
      });
  };

  const toggleTopStatus = (sId) => {
    const config = { headers: { Authorization: `Bearer ${state.adminToken}` } };
    let data = { sId };
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/admin/toggletopstatusschool",
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
      <div heading_title={"Schools List"}>
        <>
          <div className="row min-height-vh-100">
            <div className="row p-45">
              <div className="col-12 mt-4">
                <div className="headerr d-flex align-items-end justify-content-end">
                  {/* <button className="btn AddDataBtn">Add</button> */}
                  {/* <button className="btn AddDataBtn" onClick={()=>navigate("/admin/addschools")}>Import</button> */}
                </div>
                <div className="flex p-2 items-end justify-end">
                  {/* <div className="filter-group w-[200px]">
                    <MultiSelect
                      id=""
                      options={tableColumns}
                      value={selectedColumns}
                      onChange={(value, b) => {
                        setSelectedColumns(value);
                        let newVal = value.map((val) => val.label);
                        setSelectedColumnsTable(newVal);
                      }}
                      labelledBy="Advance"
                    />
                  </div> */}
                </div>

                <div className="schoolFilters mb-4">
                  <div className="left">
                    <div className="school-list-btn flex items-center gap-4">
                      {/* <DropdownPrimary
                        title={"CSV"}
                        list={[{ title: "a" }, { title: "b" }]}
                        active={false}
                      />

                      <DropdownPrimary
                        title={"Sortby"}
                        list={[{ title: "a" }, { title: "b" }]}
                        active={false}
                      /> */}

                      <div className="btn_outerxx">
                        <ButtonPrimary
                          title={"Filter"}
                          onclick={() => setModalCodeFilter(!ModalCodeFilter)}
                        />
                        {ModalCodeFilter ? (
                          <div className="modal_cover filter_model">
                            <div className="modal_inner select-col-popup">
                              <div className="header_modal">
                                <div className="flex">
                                  <div className="filter-group m-2 w-3/12">
                                    <label htmlFor="" className="font-black">
                                      Country
                                    </label>
                                    <select
                                      className="uppercase rounded border-2 border-black form-control p-2"
                                      name="countryId"
                                      value={state.countryId}
                                      id="countryId"
                                      onChange={handleChange}
                                    >
                                      <option value="" selected>
                                        -- Select Country --
                                      </option>
                                      <option value="">All</option>

                                      {state.countryNamesList.map((country) => {
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
                                  <div className="filter-group m-2 w-3/12">
                                    <label htmlFor="" className="font-black">
                                      State
                                    </label>
                                    <select
                                      className="uppercase rounded border-2 border-black form-control p-2"
                                      name="stateId"
                                      value={state.stateId}
                                      id="stateId"
                                      onChange={handleChange}
                                    >
                                      <option value="" selected>
                                        -- Select State --
                                      </option>
                                      <option value="">All</option>
                                      {state.stateNamesList.map((state) => {
                                        return (
                                          <option
                                            className="uppercase"
                                            value={state.stateId}
                                          >
                                            {state.stateName}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>

                                  <div className="filter-group m-2 w-3/12">
                                    <label htmlFor="" className="font-black">
                                      City
                                    </label>
                                    <select
                                      className="uppercase rounded border-2 border-black form-control p-2"
                                      name="cityId"
                                      id="cityId"
                                      value={state.cityId}
                                      onChange={handleChange}
                                    >
                                      <option value="" selected>
                                        -- Select City --
                                      </option>
                                      <option value="">All</option>
                                      {state.cityNamesList.map((city) => {
                                        return (
                                          <option
                                            className="uppercase"
                                            value={city.cityId}
                                          >
                                            {city.cityName}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>

                                  <div className="filter-group m-2 w-3/12">
                                    <label htmlFor="" className="font-black">
                                      School Type
                                    </label>
                                    <select
                                      className="uppercase rounded border-2 border-black form-control p-2"
                                      name="filter_type"
                                      id="filter_type"
                                      value={state.filter_type}
                                      onChange={handleChange}
                                    >
                                      <option value={""} selected>
                                        -- Select Type --
                                      </option>
                                      <option value="">All</option>
                                      {/* PRIVATE_COLLEGE, PRIVATE_UNIVERSITY, PUBLIC_UNIVERSITY, PUBLIC_COLLEGE */}
                                      <option
                                        className="uppercase"
                                        value={"PRIVATE_COLLEGE"}
                                      >
                                        PUBLIC COLLEGE
                                      </option>
                                      <option
                                        className="uppercase"
                                        value={"PRIVATE_UNIVERSITY"}
                                      >
                                        PRIVATE UNIVERSITY
                                      </option>
                                      <option
                                        className="uppercase"
                                        value={"PUBLIC_UNIVERSITY"}
                                      >
                                        PUBLIC UNIVERSITY
                                      </option>
                                      <option
                                        className="uppercase"
                                        value={"PUBLIC_COLLEGE"}
                                      >
                                        PUBLIC COLLEGE
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor="" className="mx-2 font-black">
                                    Total Students
                                  </label>
                                  <div className="flex items-center gap-2 m-2 mt-0">
                                    <div className="w-50">
                                      {/* <label>Min Value</label> */}
                                      {/* <br /> */}
                                      <input
                                        className="border rounded py-1 px-2"
                                        type="text"
                                        name="filter_total_students_min"
                                        id="filter_total_students_min"
                                        value={state.filter_total_students_min}
                                        placeholder="Min Value"
                                        onChange={handleChange}
                                      />
                                    </div>

                                    <div>
                                      {/* <label>Max Value</label> */}
                                      {/* <br /> */}
                                      <input
                                        className="border rounded py-1 px-2"
                                        type="text"
                                        name="filter_total_students_max"
                                        id="filter_total_students_max"
                                        value={state.filter_total_students_max}
                                        placeholder="Max Value"
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor="" className="mx-2 font-black">
                                    International Students
                                  </label>
                                  <div className="flex items-center gap-2 m-2 mt-0">
                                    <div className="w-50">
                                      {/* <label>Min Value</label> */}
                                      {/* <br /> */}
                                      <input
                                        className="border rounded py-1 px-2"
                                        type="text"
                                        name="filter_international_students_min"
                                        id="filter_international_students_min"
                                        placeholder="Min Value"
                                        value={
                                          state.filter_international_students_min
                                        }
                                        onChange={handleChange}
                                      />
                                    </div>

                                    <div>
                                      {/* <label>Max Value</label> */}
                                      {/* <br /> */}
                                      <input
                                        className="border rounded py-1 px-2"
                                        type="text"
                                        name="filter_international_students_max"
                                        id="filter_international_students_max"
                                        value={
                                          state.filter_international_students_max
                                        }
                                        placeholder="Max Value"
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor="" className="mx-2 font-black">
                                    Founded Year
                                  </label>
                                  <div className="flex items-center gap-2 m-2 mt-0">
                                    <div className="w-50">
                                      {/* <label>Min Value</label> */}
                                      {/* <br /> */}
                                      <input
                                        className="border rounded py-1 px-2"
                                        type="text"
                                        name="filter_founded_year_min"
                                        id="filter_founded_year_min"
                                        placeholder="Min Year"
                                        value={state.filter_founded_year_min}
                                        onChange={handleChange}
                                      />
                                    </div>

                                    <div>
                                      {/* <label>Max Value</label> */}
                                      {/* <br /> */}
                                      <input
                                        className="border rounded py-1 px-2"
                                        type="text"
                                        name="filter_founded_year_max"
                                        id="filter_founded_year_max"
                                        placeholder="Max Year"
                                        value={state.filter_founded_year_max}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* "filter_accomodation_features": true,
                                  "filter_work_permit_feature": true,
                                  "filter_program_cooporation": true,
                                  "filter_work_while_study": true,
                                  "filter_condition_offer_letter": true,
                                  "filter_library": true, */}
                                <div className="flex">
                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Accomodation Features
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      {state.filter_accomodation_features ==
                                      "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_accomodation_features"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          True
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_accomodation_features"
                                            type="radio"
                                          />{" "}
                                          True
                                        </span>
                                      )}
                                      {state.filter_accomodation_features ==
                                      "false" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_accomodation_features"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_accomodation_features"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_accomodation_features ==
                                      "" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_accomodation_features"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          Both
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_accomodation_features"
                                            type="radio"
                                          />{" "}
                                          Both
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Work Permit Features
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      {state.filter_work_permit_feature ==
                                      "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_work_permit_feature"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          True
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_work_permit_feature"
                                            type="radio"
                                          />{" "}
                                          True
                                        </span>
                                      )}
                                      {state.filter_work_permit_feature ==
                                      "false" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_work_permit_feature"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_work_permit_feature"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_work_permit_feature ==
                                      "" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_work_permit_feature"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          Both
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_work_permit_feature"
                                            type="radio"
                                          />{" "}
                                          Both
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex">
                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Program Cooporation
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      {state.filter_program_cooporation ==
                                      "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_program_cooporation"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          True
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_program_cooporation"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_program_cooporation ==
                                      "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_program_cooporation"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_program_cooporation"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_program_cooporation ==
                                      "" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_program_cooporation"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_program_cooporation"
                                            type="radio"
                                          />{" "}
                                          Both
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Work while study
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      {state.filter_work_while_study ==
                                      "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_work_while_study"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          True
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_work_while_study"
                                            type="radio"
                                          />{" "}
                                          True
                                        </span>
                                      )}
                                      {state.filter_work_while_study ==
                                      "false" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_work_while_study"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_work_while_study"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_work_while_study == "" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_work_while_study"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          Both
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_work_while_study"
                                            type="radio"
                                          />{" "}
                                          Both
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex">
                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Condition offer letter
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      {state.filter_condition_offer_letter ==
                                      "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_condition_offer_letter"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          True
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_condition_offer_letter"
                                            type="radio"
                                          />{" "}
                                          True
                                        </span>
                                      )}
                                      {state.filter_condition_offer_letter ==
                                      "false" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_condition_offer_letter"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_condition_offer_letter"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_condition_offer_letter ==
                                      "" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_condition_offer_letter"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          Both
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_condition_offer_letter"
                                            type="radio"
                                          />{" "}
                                          Both
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Libraray
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      {state.filter_library == "true" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_library"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          True
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_library"
                                            type="radio"
                                          />{" "}
                                          True
                                        </span>
                                      )}
                                      {state.filter_library == "false" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_library"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          False
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_library"
                                            type="radio"
                                          />{" "}
                                          False
                                        </span>
                                      )}
                                      {state.filter_library == "" ? (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_library"
                                            type="radio"
                                            defaultChecked
                                          />{" "}
                                          Both
                                        </span>
                                      ) : (
                                        <span className="mr-2">
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_library"
                                            type="radio"
                                          />{" "}
                                          Both
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex">
                                  <div className="m-2 enter-data w-6/12">
                                    <label htmlFor="" className="m-2 font-bold">
                                      Top Status
                                    </label>
                                    <br />
                                    <div className="mx-2">
                                      <span className="mr-2">
                                        {state.filter_top_status == "true" ? (
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_top_status"
                                            type="radio"
                                            defaultChecked
                                          />
                                        ) : (
                                          <input
                                            onChange={handleChange}
                                            value="true"
                                            name="filter_top_status"
                                            type="radio"
                                          />
                                        )}
                                        True
                                      </span>
                                      <span className="mr-2">
                                        {state.filter_top_status == "false" ? (
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_top_status"
                                            type="radio"
                                            defaultChecked
                                          />
                                        ) : (
                                          <input
                                            onChange={handleChange}
                                            value="false"
                                            name="filter_top_status"
                                            type="radio"
                                          />
                                        )}
                                        False
                                      </span>
                                      <span className="mr-2">
                                        {state.filter_top_status == "" ? (
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_top_status"
                                            type="radio"
                                            defaultChecked
                                          />
                                        ) : (
                                          <input
                                            onChange={handleChange}
                                            value=""
                                            name="filter_top_status"
                                            type="radio"
                                          />
                                        )}
                                        Both
                                      </span>
                                    </div>
                                  </div>
                                  <div className="m-2 enter-data w-6/12"></div>
                                </div>

                                <GrClose
                                  className="close"
                                  onClick={() => setModalCodeFilter(false)}
                                />

                                <div className="flex justify-end p-2">
                                  <ButtonPrimary
                                    title={"Submit"}
                                    onclick={() =>
                                      getPaginationData(1, "", "", "", "", true)
                                    }
                                    loading={state.isWaiting}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* <div
                    id="dropdownOffset"
                    class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                  >
                    <ul
                      class="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefault"
                    >
                      <li>
                        <a
                          href="#"
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div> */}
                    </div>

                    <div className="btn_outerxx ml-3">
                      <button
                        onClick={() => setModalCode(!ModalCode)}
                        className="bg-gradient-primary px-6 py-2 text-white rounded  adcol-btn"
                      >
                        Columns
                      </button>
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

                <div className="overflow-auto card shadow-lg col-12 px-0 pt-0 pb-2  border">
                  <table className="table-auto overflow-scroll w-full agent-table files-table">
                    <thead>
                      <tr>
                        {tableColumns.map((col) => {
                          if (selectedColumnsTable.includes(col.label)) {
                            return (
                              <th className="p-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left">
                                {col.label}
                              </th>
                            );
                          }
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {state.schools.map((school, index) => {
                        console.log({ school });
                        return (
                          <tr>
                            {selectedColumnsTable.includes("Sr.") && (
                              <td className="p-2 capitalize">
                                <p className="text-xs font-weight-bold mb-0">
                                  {index + 1}
                                </p>
                              </td>
                            )}
                            {selectedColumnsTable.includes("Country Logo") && (
                              <td className="p-2">
                                <div className="mr-2">
                                  <img
                                    width={60}
                                    src={
                                      state.baseUrl +
                                      school?.school_meta_details.schoolLogo
                                    }
                                    className="avatar avatar-sm me-3"
                                    alt="user1"
                                  />
                                </div>
                              </td>
                            )}
                            {selectedColumnsTable.includes("School Logo") && (
                              <td className="p-2">
                                <div className="mr-2">
                                  <img
                                    width={60}
                                    src={
                                      state.baseUrl +
                                      school?.school_meta_details.countryLogo
                                    }
                                    className="avatar avatar-sm me-3"
                                    alt="user1"
                                  />
                                </div>
                              </td>
                            )}
                            {selectedColumnsTable.includes("School Name") && (
                              <td className="p-2 capitalize">
                                <div className="d-flex flex-column justify-content-center">
                                  <h6
                                    className="mb-0 text-sm hover-underline"
                                    onClick={() =>
                                      navigate(
                                        "/d/admin/programs/" + school._id
                                      )
                                    }
                                  >
                                    {school.school_name}
                                  </h6>
                                  <p className="text-xs text-secondary mb-0 capitalize">
                                    {school.school_location}
                                  </p>
                                </div>
                              </td>
                            )}
                            {selectedColumnsTable.includes("Country") && (
                              <td className="p-2 capitalize">
                                {school.country}
                              </td>
                            )}
                            {selectedColumnsTable.includes("State") && (
                              <td className="p-2 capitalize">{school.state}</td>
                            )}
                            {selectedColumnsTable.includes("City") && (
                              <td className="p-2 capitalize">{school.city}</td>
                            )}
                            {selectedColumnsTable.includes(
                              "Total Programs"
                            ) && (
                              <td className="p-2 align-middle text-center capitalize">
                                <span className="text-secondary text-xs font-weight-bold">
                                  {school.school_programs.length}
                                </span>
                              </td>
                            )}
                            {selectedColumnsTable.includes("Type") && (
                              <td className="p-2  align-middle text-center capitalize">
                                <span className="text-secondary text-xs font-weight-bold">
                                  {school.type}
                                </span>
                              </td>
                            )}
                            {selectedColumnsTable.includes(
                              "Total Students"
                            ) && (
                              <td className="p-2  align-middle text-center">
                                <span className="text-secondary text-xs font-weight-bold">
                                  {school.total_student}
                                </span>
                              </td>
                            )}
                            {selectedColumnsTable.includes("Founded") && (
                              <td className="p-2  align-middle text-center">
                                <span className="text-secondary text-xs font-weight-bold">
                                  {school.founded}
                                </span>
                              </td>
                            )}
                            {selectedColumnsTable.includes("Top Status") && (
                              <td className="p-2 text-center">
                                {Boolean(school.top_status) != false ? (
                                  <Switch
                                    color="primary"
                                    defaultChecked
                                    onClick={(e) => {
                                      if (window.confirm("Are you sure ?")) {
                                        toggleTopStatus(school._id);
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
                                      if (window.confirm("Are you sure ?")) {
                                        toggleTopStatus(school._id);
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
                            {selectedColumnsTable.includes("Actions") && (
                              <td className="p-1 border-2 text-center">
                                <div className="action-icons-list">
                                  <svg
                                    className="action-icon"
                                    onClick={() =>
                                      navigate(
                                        "/d/admin/schoolupdate/" + school._id
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
                            {/* {
                                    selectedColumnsTable.includes("Actions") &&
                                    <td className="p-2 border-2 align-middle text-center">
                                        <Link to={"/d/admin/schoolupdate/" + school._id}>Edit</Link>
                                    </td>
                                } */}
                          </tr>
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
          </div>
        </>
      </div>
    </>
  );
};

export default SchoolList;
