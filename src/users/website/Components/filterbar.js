import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, Icon } from "semantic-ui-react";
import Formaccordian from "./Formaccordian";

const FilterBar = (props) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [filters, setFilters] = useState(JSON.parse(props.filters));

  const [state, setState] = useState({
    iletsScore: [0, 0, 0, 0],
    pteScore: 0,
    tofelScore: 0,
    newStreams: [],
    countryList: [],
    iswait: true,
  });

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/country")
      .then((countryResponse) => {
        if (filters.exam.type == "IELTS") {
          setState({
            ...state,
            iletsScore: filters.exam.score,
            newStreams: filters.new_stream,
            iswait: false,
            countryList: countryResponse.data.details.countries,
          });
        }
        if (filters.exam.type == "TOFEL") {
          setState({
            ...state,
            tofelScore: filters.exam.score,
            newStreams: filters.new_stream,
            iswait: false,
            countryList: countryResponse.data.details.countries,
          });
        }
        if (filters.exam.type == "PTE") {
          setState({
            ...state,
            pteScore: filters.exam.score,
            newStreams: filters.new_stream,
            iswait: false,
            countryList: countryResponse.data.details.countries,
          });
        }
      });
  }, []);

  useEffect(() => {}, []);

  const streams = [
    "Engineering",
    "Technology",
    "Skill Trades",
    "Transportation",
    "Science",
    "Arts",
    "Media",
    "Design",
    "Law",
    "Politics",
    "Community Service",
    "Education",
    "Business",
    "Management",
    "Economics",
    "Administration",
    "Accounting",
    "English For Academic Studies",
    "Health Sciences",
    "Medicine",
    "Nursing",
    "Paramedic",
  ];
  const handleClick = (index) => {
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const handleChangeExam = (e) => {
    if (e.target.name == "tofel_score") {
      setState({
        ...state,
        tofelScore: e.target.value,
      });
      applyFilter("exam", { type: "TOFEL", score: e.target.value });
    }
    if (e.target.name == "pte_score") {
      setState({
        ...state,
        pteScore: e.target.value,
      });
      applyFilter("exam", { type: "PTE", score: e.target.value });
    }
    if (e.target.name == "writing") {
      setState({
        ...state,
        iletsScore: [
          parseFloat(e.target.value) || 0,
          state.iletsScore[1],
          state.iletsScore[2],
          state.iletsScore[3],
        ],
      });
      applyFilter("exam", {
        type: "IELTS",
        score: [
          parseFloat(e.target.value) || 0,
          state.iletsScore[1],
          state.iletsScore[2],
          state.iletsScore[3],
        ],
      });
    }
    if (e.target.name == "reading") {
      setState({
        ...state,
        iletsScore: [
          state.iletsScore[0],
          parseFloat(e.target.value) || 0,
          state.iletsScore[2],
          state.iletsScore[3],
        ],
      });
      applyFilter("exam", {
        type: "IELTS",
        score: [
          state.iletsScore[0],
          parseFloat(e.target.value) || 0,
          state.iletsScore[2],
          state.iletsScore[3],
        ],
      });
    }
    if (e.target.name == "speaking") {
      setState({
        ...state,
        iletsScore: [
          state.iletsScore[0],
          state.iletsScore[1],
          parseFloat(e.target.value) || 0,
          state.iletsScore[3],
        ],
      });
      applyFilter("exam", {
        type: "IELTS",
        score: [
          state.iletsScore[0],
          state.iletsScore[1],
          parseFloat(e.target.value) || 0,
          state.iletsScore[3],
        ],
      });
    }
    if (e.target.name == "listening") {
      setState({
        ...state,
        iletsScore: [
          state.iletsScore[0],
          state.iletsScore[1],
          state.iletsScore[2],
          parseFloat(e.target.value) || 0,
        ],
      });
      applyFilter("exam", {
        type: "IELTS",
        score: [
          state.iletsScore[0],
          state.iletsScore[1],
          state.iletsScore[2],
          parseFloat(e.target.value) || 0,
        ],
      });
    }
  };

  const changeExamType = (e) => {
    setFilters({
      ...filters,
      exam: {
        ...filters.exam,
        type: e.target.value,
      },
    });
    applyFilter("exam", {
      type: e.target.value,
      score:
        e.target.value == "TOFEL"
          ? state.tofelScore
          : e.target.value == "PTE"
          ? state.pteScore
          : state.iletsScore,
    });
  };

  const handleNewStream = (list) => {
    console.log({ list });
    let old_newstream = state.newStreams;
    list.map((item) => {
      if (old_newstream.includes(item)) {
        var index = old_newstream.indexOf(item);
        if (index !== -1) {
          old_newstream.splice(index, 1);
        }
      } else {
        old_newstream.push(item);
      }
    });
    console.log({ old_newstream });
    setState({
      ...state,
      newStreams: old_newstream,
    });
    applyFilter("new_stream", old_newstream);
  };

  const applyFilter = (newKey, newValue) => {
    var oldFilters = filters;
    oldFilters[newKey] = newValue;
    console.log("NOW");
    console.log({ oldFilters });
    props.filterNow(oldFilters);

    // if (oldFilters.exam.type == "IELTS") {
    //   oldFilters.exam.score = state.iletsScore;
    // }
    // if (oldFilters.exam.type == "PTE") {
    //   oldFilters.exam.score = state.pteScore;
    // }
    // if (oldFilters.exam.type == "TOFEL") {
    //   oldFilters.exam.score = state.tofelScore;
    // }
    // oldFilters.new_stream = state.newStreams;

    // this is the new query data
    // var jsondata = JSON.stringify(oldFilters);
    // console.log({oldFilters})
    // window.location.href = "/search/" + jsondata
  };
  function feesFormat(value) {
    var val = Math.abs(value);
    if (val >= 10000000) {
      return (val / 10000000).toFixed(2) + " Cr";
    }
    if (val >= 100000) {
      return (val / 100000).toFixed(2) + " Lac";
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(2) + " Thousand";
    }
    return val;
  }

  if (state.iswait) {
    return "Loading...";
  }

  return (
    <Accordion>
      <Accordion.Title
        onClick={() => handleClick(0)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 0 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2 text-white text-xl   m-0 w-full">
          Language Scores
        </h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 0 ? "filter-tab active" : "filter-tab"}`}
      >
        <div className="lg:flex gap-4">
          <div className="w-full">
            <div>
              <label className="font-bold text-white">Select Exam</label>
              <br />
              <select
                className="p-2 w-full"
                onChange={(e) => changeExamType(e)}
              >
                {filters.exam.type == "IELTS" ? (
                  <option value="IELTS" selected>
                    IELTS
                  </option>
                ) : (
                  <option value="IELTS">IELTS</option>
                )}
                {filters.exam.type == "PTE" ? (
                  <option value="PTE" selected>
                    PTE
                  </option>
                ) : (
                  <option value="PTE">PTE</option>
                )}
                {filters.exam.type == "TOFEL" ? (
                  <option value="TOFEL" selected>
                    TOFEL
                  </option>
                ) : (
                  <option value="TOFEL">TOFEL</option>
                )}
                {filters.exam.type == "NOT_HAVE" ? (
                  <option value="NOT_HAVE" selected>
                    I don't have this
                  </option>
                ) : (
                  <option value="NOT_HAVE">I don't have this</option>
                )}
              </select>
              {filters.exam.type == "IELTS" ? (
                <div className="lg:flex  gap-4  inner-course" style={{}}>
                  <div>
                    <label className="text-white">Speaking:</label>
                    <input
                      type="text"
                      name="speaking"
                      value={state.iletsScore[2]}
                      onChange={(e) => handleChangeExam(e)}
                      className="me-3 speaking border border-current h-9 p-2"
                    />
                  </div>
                  <div>
                    <label className="text-white">Listening:</label>
                    <input
                      type="text"
                      name="listening"
                      value={state.iletsScore[3]}
                      onChange={(e) => handleChangeExam(e)}
                      className="me-3 listening border border-current  h-9 p-2"
                    />
                  </div>
                  <div>
                    <label className="text-white">Reading:</label>
                    <input
                      type="text"
                      name="reading"
                      value={state.iletsScore[1]}
                      onChange={(e) => handleChangeExam(e)}
                      className="me-3 reading border border-current  h-9 p-2"
                    />
                  </div>
                  <div>
                    <label className="text-white">Writing:</label>
                    <input
                      type="text"
                      name="writing"
                      value={state.iletsScore[0]}
                      onChange={(e) => handleChangeExam(e)}
                      className="writing border border-current  h-9 p-2"
                    />
                  </div>
                </div>
              ) : filters.exam.type == "TOFEL" ? (
                <div>
                  <label className="text-white">Tofel Score:</label>
                  <input
                    type="text"
                    name="tofel_score"
                    value={state.tofelScore}
                    onChange={(e) => handleChangeExam(e)}
                    className="writing border border-current  h-9 p-2 w-full"
                  />
                  <div className="error-field-tofel_score text-danger"></div>
                </div>
              ) : filters.exam.type == "PTE" ? (
                <div>
                  <label className="text-white">Pte Score:</label>
                  <input
                    type="text"
                    name="pte_score"
                    value={state.pteScore}
                    onChange={(e) => handleChangeExam(e)}
                    className="writing border border-current  h-9 p-2 w-full"
                  />
                  <div className="error-field-pte_score text-danger"></div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </Accordion.Content>

      <Accordion.Title
        onClick={() => handleClick(1)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 1 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2 text-white text-xl  m-0 w-full">
          Grade Scores
        </h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 1 ? "filter-tab active" : "filter-tab"}`}
      >
        <div className="w-full">
          <div>
            <label className="font-bold text-white">
              Choose your grade score
            </label>
            <br />
            <input
              className="w-full bg-white h-9"
              type="text"
              name="grade_score"
              value={filters.grade_score}
              onChange={(e) => {
                setFilters({ ...filters, grade_score: e.target.value });
                applyFilter("grade_score", e.target.value);
              }}
            />
          </div>
        </div>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 2}
        onClick={() => handleClick(2)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 2 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2  text-xl text-white m-0 w-full">Country</h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 2 ? "filter-tab active" : "filter-tab"}`}
      >
        <div className="w-full">
          <div>
            <label className="font-bold text-white">Choose your country</label>
            <br />
            <select
              className="p-2 w-full"
              onChange={(e) => {
                setFilters({ ...filters, country_to_go: e.target.value });
                applyFilter("country_to_go", e.target.value);
              }}
            >
              {state.countryList.map((country) => {
                if (filters.country_to_go == country.countryId) {
                  return (
                    <option value={country.countryId} selected>
                      {country.countryName}
                    </option>
                  );
                } else {
                  return (
                    <option value={country.countryId}>
                      {country.countryName}
                    </option>
                  );
                }
              })}
            </select>
          </div>
        </div>
      </Accordion.Content>

      <Accordion.Title
        onClick={() => handleClick(3)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 3 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2  text-xl text-white m-0 w-full">
          Program level
        </h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 3 ? "filter-tab active" : "filter-tab"}`}
      >
        <div className="w-full">
          <div>
            <label className="font-bold">Highest Education</label>
            <br />
            <select
              className="p-2 w-full"
              onChange={(e) => {
                setFilters({ ...filters, highest_education: e.target.value });
                applyFilter("highest_education", e.target.value);
              }}
            >
              <option value="">--Select--</option>
              {filters.highest_education == "secondary" ? (
                <option value="secondary" selected>
                  Grade 12/High School
                </option>
              ) : (
                <option value="secondary">Grade 12/High School</option>
              )}
              {filters.highest_education == "certificate" ? (
                <option value="certificate" selected>
                  1-Year Post-Secondary Certificate
                </option>
              ) : (
                <option value="certificate">
                  1-Year Post-Secondary Certificate
                </option>
              )}
              {filters.highest_education == "diploma" ? (
                <option value="diploma" selected>
                  2-Year Undergraduate Diploma
                </option>
              ) : (
                <option value="diploma">2-Year Undergraduate Diploma</option>
              )}
              {filters.highest_education == "advance_diploma" ? (
                <option value="advance_diploma" selected>
                  3-Year Undergraduate Advanced Diploma
                </option>
              ) : (
                <option value="advance_diploma">
                  3-Year Undergraduate Advanced Diploma
                </option>
              )}
              {filters.highest_education == "3_year_bachlor" ? (
                <option value="3_year_bachlor" selected>
                  3-Year Bachelor's Degree
                </option>
              ) : (
                <option value="3_year_bachlor">3-Year Bachelor's Degree</option>
              )}
              {filters.highest_education == "4_year_bachlor" ? (
                <option value="4_year_bachlor" selected>
                  4-Year Bachelor's Degree
                </option>
              ) : (
                <option value="4_year_bachlor">4-Year Bachelor's Degree</option>
              )}
              {filters.highest_education == "postgraduate_diploma" ? (
                <option value="postgraduate_diploma" selected>
                  Postgraduate Certificate/Diploma
                </option>
              ) : (
                <option value="postgraduate_diploma">
                  Postgraduate Certificate/Diploma
                </option>
              )}
              {filters.highest_education == "master" ? (
                <option value="master" selected>
                  Master's Degree
                </option>
              ) : (
                <option value="master">Master's Degree</option>
              )}
              {filters.highest_education == "doctrate" ? (
                <option value="doctrate" selected>
                  Doctoral Degree (Phd, M.D., ...)
                </option>
              ) : (
                <option value="doctrate">
                  Doctoral Degree (Phd, M.D., ...)
                </option>
              )}
            </select>
          </div>
        </div>
      </Accordion.Content>

      <Accordion.Title
        onClick={() => handleClick(4)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 4 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2  text-xl text-white m-0 w-full">
          Program filters
        </h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 4 ? "filter-tab active" : "filter-tab"}`}
      >
        <div className="w-full">
          <div>
            <label className="font-bold text-white">School Types</label>
            <br />
            <div className="">
              <select
                className="form-group"
                name="school_type"
                onChange={(e) => {
                  setFilters({ ...filters, school_type: e.target.value });
                  applyFilter("school_type", e.target.value);
                }}
              >
                {!filters.school_type || filters.school_type == "" ? (
                  <option value="" selected>
                    --Select--
                  </option>
                ) : (
                  <option value="">--Select--</option>
                )}
                {filters.school_type == "" ? (
                  <option value="" selected>
                    Both
                  </option>
                ) : (
                  <option value="">Both</option>
                )}
                {filters.school_type == "college" ? (
                  <option value="college" selected>
                    College
                  </option>
                ) : (
                  <option value="college">College</option>
                )}
                {filters.school_type == "university" ? (
                  <option value="university" selected>
                    University
                  </option>
                ) : (
                  <option value="university">University</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </Accordion.Content>

      <Accordion.Title
        onClick={() => handleClick(5)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 5 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2  text-xl text-white m-0 w-full">
          What disciplines do you want to study?
        </h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 5 ? "filter-tab active" : "filter-tab"}`}
      >
        {streams.map((item) => {
          return (
            <div className="flex items-center mb-2">
              <p className="text-white">
                {state.newStreams.includes(item) ? (
                  <input
                    value={item}
                    name="stream"
                    className="mr-2"
                    type="checkbox"
                    onChange={(e) => handleNewStream([item])}
                    checked
                  />
                ) : (
                  <input
                    value={item}
                    name="stream"
                    className="mr-2"
                    type="checkbox"
                    onChange={(e) => handleNewStream([item])}
                  />
                )}
                {item}
              </p>
            </div>
          );
        })}
      </Accordion.Content>

      <Accordion.Title
        onClick={() => handleClick(6)}
        className={`flex items-center pb-0 filter-tab-title ${
          activeIndex == 6 ? "active" : ""
        }`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-2  text-xl text-white m-0 w-full">
          Tuition Fees
        </h2>
      </Accordion.Title>
      <Accordion.Content
        className={`${activeIndex == 6 ? "filter-tab active" : "filter-tab"}`}
      >
        {/* {feesFormat(filters?.fees || 0)} */}
        <p className="text-white flex items-center">
          {/* <input type="range" min="1" max="100000" value={filters?.fees || 0} class="slider" id="myRange" onChange={(e) => {
            setFilters({ ...filters, fees: e.target.value })
            applyFilter("fees", e.target.value)
          }} /> */}
          <input
            type="text"
            className="w-6/12 mr-2"
            name="fees_min"
            placeholder="Minimum"
            onChange={(e) => {
              setFilters({
                ...filters,
                fees: { ...filters.fees, min: e.target.value },
              });
              applyFilter("fees", {
                ...filters.fees,
                min: e.target.value,
              });
            }}
          />
          <input
            type="text"
            className="w-6/12"
            name="fees_max"
            placeholder="Maximum"
            onChange={(e) => {
              setFilters({
                ...filters,
                fees: { ...filters.fees, max: e.target.value },
              });
              applyFilter("fees", {
                ...filters.fees,
                max: e.target.value,
              });
            }}
          />
        </p>
      </Accordion.Content>
      {/* <div className="p-5">
        <button className="apply-btn btn btn-primary text-black m-2 bg-white" onClick={applyFilter}>Apply</button>
      </div> */}
    </Accordion>
  );
};

export default FilterBar;
