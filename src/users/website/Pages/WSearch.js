import React from "react";
import Un_logo from "../images/un_logo.jpg";
import Aus from "../images/aus.png";
import Filterbar from "../Components/filterbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import WebsiteHome from "../Screens/WebsiteHome";
import { getToken } from "../../../helper/auth";

export default function WSearch() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    data: {},
    dataSchools: [],
    wait: true,
    currentPage: 1,
    noMore: false,
    buttonLoading: true,
    filterLoading: false,
    baseUrl: "",
  });
  useEffect(() => {
    let api_data = JSON.parse(query);
    console.log({ api_data });

    setState({
      ...state,
      buttonLoading: true,
    });

    axios
      .post(`${process.env.REACT_APP_NODE_URL}/student/search`, api_data)
      .then((response) => {
        setState({
          ...state,
          data: {
            totalPrograms: response.data.details.totalPrograms,
            totalSchools: response.data.details.totalSchools,
          },
          dataSchools: [...state.dataSchools, ...response.data.details.schools],
          wait: false,
          noMore: response.data.details.noMore,
          buttonLoading: false,
          currentPage: 1,
          baseUrl: response.data.details.baseUrl,
        });
        console.log(response);
      });
  }, []);

  const handleToggle = (index) => {
    var element = document.getElementById("toggleEligibleBox_" + index);
    element.classList.toggle("open-data");
  };

  const filterNow = (api_data) => {
    setState({
      ...state,
      filterLoading: true,
    });

    axios
      .post(`${process.env.REACT_APP_NODE_URL}/student/search`, api_data)
      .then((response) => {
        setState({
          ...state,
          data: {
            totalPrograms: response.data.details.totalPrograms,
            totalSchools: response.data.details.totalSchools,
          },
          dataSchools: response.data.details.schools,
          wait: false,
          noMore: response.data.details.noMore,
          filterLoading: false,
          currentPage: 1,
        });
        console.log(response);
      });
  };

  const load_more = () => {
    let api_data = JSON.parse(query);
    console.log({ api_data });

    setState({
      ...state,
      buttonLoading: true,
    });

    axios
      .post(
        `${process.env.REACT_APP_NODE_URL}/student/search?page=${
          state.currentPage + 1
        }`,
        api_data
      )
      .then((response) => {
        setState({
          ...state,
          data: {
            totalPrograms: response.data.details.totalPrograms,
            totalSchools: response.data.details.totalSchools,
          },
          dataSchools: [...state.dataSchools, ...response.data.details.schools],
          wait: false,
          noMore: response.data.details.noMore,
          buttonLoading: false,
          currentPage: state.currentPage + 1,
        });
        console.log(response);
      });
  };

  const enrollNow = (sid, pid) => {
    let studentToken = getToken("student");
    if (studentToken) {
      // enroll API
      let api_data = {
        student_id: "anything",
        school_id: sid,
        program_id: pid,
      };
      const config = { headers: { Authorization: `Bearer ${studentToken}` } };

      axios
        .post(
          `${process.env.REACT_APP_NODE_URL}/student/enroll`,
          api_data,
          config
        )
        .then((response) => {
          console.log(response);
          alert(response.data.message);
          navigate("/d/student/");
        });
    } else {
      // Login then Enroll
      alert("Login First");

      navigate(
        "/d?user=student&redirect=true&type=enroll&school=" +
          sid +
          "&program=" +
          pid
      );
    }
  };
  return (
    <WebsiteHome>
      <div className="search-content py-16">
        <div className="container mx-auto">
          {state.wait ? (
            <center>
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </center>
          ) : (
            <>
              <h1 className="text-center font-bold mb-8 text-3xl">
                You have{" "}
                <span style={{ color: "green" }}>
                  {state.data.totalPrograms}
                </span>{" "}
                matching programs from{" "}
                <span style={{ color: "green" }}>
                  {state.data.totalSchools}
                </span>{" "}
                Schools/University!
              </h1>

              <div className="filter-part w-full  mt-10 lg:flex gap-8">
                <div className="right-part h-[fit-content] border border-[#f4f5f6] rounded pb-5">
                  <Filterbar filters={query} filterNow={filterNow} />
                </div>
                <div className="left-part h-[750px] overflow-y-auto">
                  {state.filterLoading ? (
                    <center>
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </center>
                  ) : (
                    <>
                      {state.dataSchools.map((school, index) => {
                        return (
                          <div className=" border border-[#f4f5f6] shadow p-8 rounded-sm mb-8">
                            <div className="flex search-main">
                              <div>
                                <img
                                  className="un-logo rouded-full  p-2"
                                  src={
                                    state.baseUrl +
                                    school.school_meta_details.schoolLogo
                                  }
                                />
                              </div>
                              <div className="pl-3 edu-content">
                                <h2 className="text-left text-black text-xl  font-bold capitalize">
                                  {school.school_name}
                                </h2>

                                <p className="flex items-center country-text font-bold capitalize">
                                  <img
                                    className="w-10 mr-2 border border-current"
                                    src={
                                      state.baseUrl +
                                      school.school_meta_details.countryLogo
                                    }
                                  />
                                  {school.country}
                                </p>

                                <button
                                  onClick={() => handleToggle(index)}
                                  class="view-program  bg-[#1c3479] hover:bg-[#1c3479e0] text-white font-bold py-4 px-10 rounded-full mt-8 text-md"
                                >
                                  View Eligible {school.school_programs.length}{" "}
                                  Programs
                                </button>
                              </div>

                              <div className="ml-auto">
                                <div className="info-text">
                                  <p className="text-lg flex items-center text-black font-bold mb-6">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="#149449"
                                      className="mr-1 w-7 h-7"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    Total Students :{" "}
                                    <b>&nbsp;{school.total_student}</b>
                                  </p>

                                  <p className="flex items-center text-lg text-black font-bold mb-6">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="#149449"
                                      className="mr-1 w-7 h-7"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                                      />
                                    </svg>
                                    Type : <b>&nbsp;{school.type}</b>
                                  </p>

                                  <p className="flex items-center text-lg text-black font-bold mb-6">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="#149449"
                                      className="mr-1 w-7 h-7"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                      />
                                    </svg>
                                    Founded : <b>&nbsp;{school.founded}</b>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              id={`toggleEligibleBox_${index}`}
                              className="info-data programsList mt-3"
                            >
                              <ul>
                                {school.school_programs.map((program) => {
                                  return (
                                    <div>
                                      {/* <h2 className="text-left">Eligible Programs</h2> */}
                                      <li className="mb-5">
                                        <p className="text-left">
                                          <h1 className="font-bold text-xl mb-2">
                                            {program.program_name}
                                          </h1>
                                          <p className="text-lg mb-2">
                                            Certificate :{" "}
                                            <span className="font-bold">
                                              {program.credentials}
                                            </span>
                                          </p>
                                          <table className="programTable">
                                            <tr className="m-1">
                                              <th className="pe-3 m-1 mr-3">
                                                <span>
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#149449"
                                                    class="w-6 h-6"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                                                    />
                                                  </svg>
                                                </span>
                                                <span className="text-[16px]">
                                                  Tuition Fee
                                                </span>
                                              </th>
                                              <th className="px-3 m-1 mr-3">
                                                <span>
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#149449"
                                                    class="w-6 h-6"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                                                    />
                                                  </svg>
                                                </span>
                                                <span className="text-[16px]">
                                                  Application Fee
                                                </span>
                                              </th>
                                              <th className="px-3 m-1 mr-3">
                                                <span>
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#149449"
                                                    class="w-6 h-6"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                  </svg>
                                                </span>
                                                <span className="text-[16px]">
                                                  Duration
                                                </span>
                                              </th>
                                              <th className="px-3 m-1 mr-3">
                                                <span>
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#149449"
                                                    class="w-6 h-6"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                    />
                                                  </svg>
                                                </span>
                                                <span className="text-[16px]">
                                                  Percentage Required
                                                </span>
                                              </th>
                                            </tr>
                                            <tr>
                                              <td className="pe-3 m-1 mr-2">
                                                {
                                                  program.min_tution_fee_per_semester
                                                }
                                                -
                                                {parseInt(
                                                  program.max_tution_fee
                                                ) + 1000}
                                              </td>
                                              <td className="px-3 m-1 mr-2">
                                                {program.application_fee == 0
                                                  ? "Free"
                                                  : program.application_fee}
                                              </td>
                                              <td className="px-3 m-1 mr-2">
                                                {program["duration"] +
                                                  " Year" || program?.duration}
                                              </td>
                                              <td className="px-3 m-1 mr-2">
                                                {program.grade_score}%
                                              </td>
                                            </tr>
                                          </table>
                                        </p>
                                        <p className="text-left mt-2">
                                          {program.description}
                                        </p>
                                        {/* <p className="text-left">
                                            <b>Additional Requirements :</b> {program.other_comments}
                                          </p> */}
                                        <div className="info-ftr flex flex-col items-start gap-2">
                                          <button
                                            class="bg-[#1c3479] hover:bg-[#1c3479e0] text-white font-bold py-2 px-8 rounded-full capitalize"
                                            onClick={() =>
                                              enrollNow(
                                                school._id,
                                                program.program_id
                                              )
                                            }
                                          >
                                            enroll now
                                          </button>
                                          {program.few_seats_status && (
                                            <span className="mx-4 my-2 fewSeatsLeft text-danger">
                                              Few seats left
                                            </span>
                                          )}
                                        </div>
                                      </li>
                                    </div>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                      <center>
                        {state.noMore ? (
                          <p>No more data</p>
                        ) : state.buttonLoading ? (
                          <center>
                            <div role="status">
                              <svg
                                aria-hidden="true"
                                class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                              <span class="sr-only">Loading...</span>
                            </div>
                          </center>
                        ) : (
                          <button
                            className="btn btn-primary text-black m-2 bg-white load-more-btn"
                            onClick={() => load_more()}
                          >
                            Load More
                          </button>
                        )}
                      </center>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </WebsiteHome>
  );
}
