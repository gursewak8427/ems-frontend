import React, { Component, useEffect, useState } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccordionExampleStandard = () => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    activeIndex: 0,
    iswait: true,
    countryList: []
  })


  const [formData, setFormData] = useState({
    nationality: "",
    highestEducation: "",
    gradingScheme: "",
    gradeAverage: "",
    name: "",
    phoneNumber: "",
    email: "",
    country_to_go: "",
    examType: "",
    tofel_score: "",
    pte_score: "",
    speaking: "",
    listening: "",
    writing: "",
    reading: "",
    new_stream: [],
  });


  useEffect(() => {
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/country").then(countryResponse => {
        console.log({ countryResponse })
        setState({
          ...state,
          iswait: false,
          countryList: countryResponse.data.details.countries
        })
      })
  }, [])

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const getErrors = () => {
    let error = false;
    if (formData.nationality == "") {
      document.getElementsByClassName("error-field-nationality")[0].innerText = "Nationality is requried"
      error = true;
    } else {
      document.getElementsByClassName("error-field-nationality")[0].innerText = ""
    }
    if (formData.highestEducation == "") {
      document.getElementsByClassName("error-field-highestEducation")[0].innerText = "Highest Education is requried"
      error = true;
    } else {
      document.getElementsByClassName("error-field-highestEducation")[0].innerText = ""
    }
    if (formData.gradingScheme == "") {
      error = true;
      document.getElementsByClassName("error-field-gradingScheme")[0].innerText = "Grading Scheme is requried"
    } else {
      document.getElementsByClassName("error-field-gradingScheme")[0].innerText = ""
    }
    if (formData.gradeAverage == "") {
      error = true;
      document.getElementsByClassName("error-field-gradeAverage")[0].innerText = "Grade Average is requried"
    } else {
      document.getElementsByClassName("error-field-gradeAverage")[0].innerText = ""
    }
    if (formData.name == "") {
      error = true;
      document.getElementsByClassName("error-field-name")[0].innerText = "Name is requried"
    } else {
      document.getElementsByClassName("error-field-name")[0].innerText = ""
    }
    if (formData.phoneNumber == "") {
      error = true;
      document.getElementsByClassName("error-field-phoneNumber")[0].innerText = "Phone Number is requried"
    } else {
      if (formData.phoneNumber.length != 10) {
        error = true;
        document.getElementsByClassName("error-field-phoneNumber")[0].innerText = "Phone number is Invalid"
      }
      else
        document.getElementsByClassName("error-field-phoneNumber")[0].innerText = ""
    }
    if (formData.email == "") {
      error = true;
      document.getElementsByClassName("error-field-email")[0].innerText = "Email is requried"
    } else {
      document.getElementsByClassName("error-field-email")[0].innerText = ""
    }
    if (formData.country_to_go == "") {
      error = true;
      document.getElementsByClassName("error-field-country_to_go")[0].innerText = "Country is requried"
    } else {
      document.getElementsByClassName("error-field-country_to_go")[0].innerText = ""
    }
    return error;
  }

  const handleNext = () => {
    var isError = getErrors();
    if (!isError) {
      uploadQueryNow()
      setState({
        ...state,
        activeIndex: 1,
      })
    }
    window.scrollTo(0, 0);
  };

  const getErrorsExam = () => {
    let error = false;
    if (formData.examType == "") {
      document.getElementsByClassName("error-field-examType")[0].innerText = "Exam Type is requried"
      error = true;
    } else {
      document.getElementsByClassName("error-field-examType")[0].innerText = ""
    }
    if (formData.examType == "IELTS") {
      if (formData.writing == "") {
        document.getElementsByClassName("error-field-writing")[0].innerText = "writing is requried"
        error = true;
      } else {
        document.getElementsByClassName("error-field-writing")[0].innerText = ""
      }
      if (formData.listening == "") {
        document.getElementsByClassName("error-field-listening")[0].innerText = "Listening is requried"
        error = true;
      } else {
        document.getElementsByClassName("error-field-listening")[0].innerText = ""
      }
      if (formData.reading == "") {
        document.getElementsByClassName("error-field-reading")[0].innerText = "Reading is requried"
        error = true;
      } else {
        document.getElementsByClassName("error-field-reading")[0].innerText = ""
      }
      if (formData.speaking == "") {
        document.getElementsByClassName("error-field-speaking")[0].innerText = "Speaking is requried"
        error = true;
      } else {
        document.getElementsByClassName("error-field-speaking")[0].innerText = ""
      }
    }

    if (formData.examType == "PTE") {
      if (formData.pte_score == "") {
        document.getElementsByClassName("error-field-pte_score")[0].innerText = "Pte Score is requried"
        error = true;
      } else {
        document.getElementsByClassName("error-field-pte_score")[0].innerText = ""
      }
    }

    if (formData.examType == "TOFEL") {
      if (formData.tofel_score == "") {
        document.getElementsByClassName("error-field-tofel_score")[0].innerText = "Tofel Score is requried"
        error = true;
      } else {
        document.getElementsByClassName("error-field-tofel_score")[0].innerText = ""
      }
    }

    return error;
  }

  const handleNextExam = () => {
    var isError = getErrorsExam();
    if (!isError) {
      setState({
        ...state,
        activeIndex: 2,
      })
    }
  };

  const handleNewStream = (list) => {
    let old_newstream = formData.new_stream
    list.map(item => {
      if (old_newstream.includes(item)) {
        var index = old_newstream.indexOf(item);
        if (index !== -1) {
          old_newstream.splice(index, 1);
        }
      } else {
        old_newstream.push(item)
      }
    })
    setFormData({
      ...formData,
      new_stream: old_newstream
    })
  }

  const searchNow = async () => {
    var api_data = {
      "highest_education": formData.highestEducation,
      "country_to_go": formData.country_to_go,
      "exam": {
        "type": formData.examType,
        "score": formData.examType == "IELTS" ? [
          parseFloat(formData.writing),
          parseFloat(formData.reading),
          parseFloat(formData.speaking),
          parseFloat(formData.listening)
        ] : formData.examType == "PTE" ? parseFloat(formData.pte_score) : formData.examType == "TOFEL" ? parseFloat(formData.tofel_score) : 0
      },
      "new_stream": formData.new_stream,
      "grade_score": parseFloat(formData.gradeAverage)
    }
    var jsondata = JSON.stringify(api_data);
    navigate("/search/" + jsondata)
  }

  const uploadQueryNow = async () => {
    let api_data = {
      nationality: formData.nationality,
      highesteducation: formData.highestEducation,
      grading_scheme: formData.gradingScheme,
      destination_country: formData.country_to_go,
      grade_avg: formData.gradeAverage,
      phone: formData.phoneNumber,
      email: formData.email,
      fullname: formData.name,
      created: Date.now(),
    }
    
    axios.post(`${process.env.REACT_APP_NODE_URL}/student/fillsearchqueries`, api_data).then(response => {
      console.log(response)
    });
  }


  if (state.iswait) {
    return "Loading..."
  }


  return (
    <Accordion className="shadow-xl p-4 border-2 border-[#1c3479] rounded-lg">
      <Accordion.Title
        active={state.activeIndex === 0}
        className={`flex items-center pb-0 ${state.activeIndex != 0 ? "hidden" : ""}`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-4  text-white m-0 w-full">
          How were your most recent grades?
        </h2>
      </Accordion.Title>
      <Accordion.Content active={state.activeIndex === 0}
        className={`${state.activeIndex != 0 ? "hidden" : ""}`}
      >
        <div className="lg:flex gap-4">
          <div className="w-full">
            <div class="inner-form grid lg:grid-cols-2 gap-4  bg-slate-100 p-5 border">
              <div>
                <div className="m-10">
                  <label>
                    Nationality<sup>*</sup>
                  </label>
                  <br />
                  <select className="border rounded-lg w-full p-2" name="nationality"
                    onChange={handleChange}>
                    <option value="">--Select--</option>
                    {
                      state.countryList.map(country => {
                        return <option value={country.countryId}>{country.countryName}</option>
                      })
                    }
                  </select >
                  <div className="error-field-nationality text-danger"></div>
                </div>

                <div className="m-10">
                  <label>
                    Grading Scheme<sup>*</sup>
                  </label>
                  <br />
                  <select className="border rounded-lg w-full p-2" name="gradingScheme"
                    onChange={handleChange}>
                    <option value="">--Select--</option>
                    <option value="secondary_level">Secondary Level - Scale: 0-100</option>
                  </select>
                  <div className="error-field-gradingScheme text-danger"></div>
                </div>

                <div className="m-10">
                  <label>
                    Name<sup>*</sup>
                  </label>
                  <br />
                  <input
                    className="border w-full rounded-lg p-2"
                    type="text"
                    name="name"
                    placeholder=""
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="error-field-name text-danger"></div>
                </div>

                <div className="m-10">
                  <label>
                    Email<sup>*</sup>
                  </label>
                  <br />
                  <input
                    className="border w-full rounded-lg p-2"
                    type="email"
                    name="email"
                    placeholder=""
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="error-field-email text-danger"></div>
                </div>
              </div>
              <div>
                <div className="m-10">
                  <label>
                    Highest Education<sup>*</sup>
                  </label>
                  <br />
                  <select className="border rounded-lg w-full p-2" name="highestEducation"

                    onChange={handleChange}>
                    <option value="">--Select--</option>
                    <option value="secondary">Grade 12/High School</option>
                    <option value="certificate">1-Year Post-Secondary Certificate</option>
                    <option value="diploma">2-Year Undergraduate Diploma</option>
                    <option value="advance_diploma">3-Year Undergraduate Advanced Diploma</option>
                    <option value="3_year_bachlor">3-Year Bachelor's Degree</option>
                    <option value="4_year_bachlor">4-Year Bachelor's Degree</option>
                    <option value="postgraduate_diploma">Postgraduate Certificate/Diploma</option>
                    <option value="master">Master's Degree</option>
                    <option value="doctrate">Doctoral Degree (Phd, M.D., ...)</option>
                  </select>
                  <div className="error-field-highestEducation text-danger"></div>
                </div>

                <div className="m-10">
                  <label>
                    Grade Average<sup>*</sup>
                  </label>
                  <br />
                  <input className="w-full p-2 border rounded-lg" type="text" name="gradeAverage"
                    value={formData.gradeAverage}
                    onChange={handleChange} />
                  <div className="error-field-gradeAverage text-danger"></div>
                </div>

                <div className="m-10">
                  <label>
                    Phone Number <sup>*</sup>
                  </label>
                  <br />
                  <input
                    className="w-full p-2 border rounded-lg"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <div className="error-field-phoneNumber text-danger"></div>
                </div>

                <div className="m-10">
                  <label>
                    Which country will you choose to go?:
                    <i className="fa fa-info-circle ml-3" aria-hidden="true"></i>
                  </label>
                  <br />
                  <select
                    className="border rounded-lg w-full p-2"
                    name="country_to_go"
                    onChange={handleChange}
                  >
                    <option value="">--Select--</option>
                    {
                      state.countryList.map(country => {
                        return <option value={country.countryId}>{country.countryName}</option>
                      })
                    }
                  </select>
                  <div className="error-field-country_to_go text-danger"></div>
                </div>

              </div>

            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
              <button
                className={`bg-[#1c3479] hover:bg-[#1c3479e0] mt-3 text-white font-bold py-2 text-lg m-1 px-10 rounded-full ${false ? "cursor-not-allowed opacity-50" : ""
                  }`}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Accordion.Content>

      <Accordion.Title
        active={state.activeIndex === 1}
        index={1}
        className={`flex items-center pb-0 ${state.activeIndex != 1 ? "hidden" : ""}`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-4  text-white m-0 w-full">
          English Exam Type
        </h2>
      </Accordion.Title>
      <Accordion.Content active={state.activeIndex === 1}
        className={`${state.activeIndex != 1 ? "hidden" : ""}`}
      >
        <div>
          <label>Exam:</label>
          <select name="examType" onChange={handleChange}>
            <option value="">--SELECT--</option>
            <option value="TOFEL">TOFEL</option>
            <option value="IELTS">IELTS</option>
            <option value="PTE">PTE</option>
          </select>
          <div className="error-field-examType text-danger"></div>
        </div>
        {
          formData.examType == "IELTS" ?
            <div className="flex gap-4 red">
              <div>
                <label>Speaking:</label>
                <input type="text" name="speaking" onChange={handleChange} className="speaking border border-current  h-9 p-2" />
                <div className="error-field-speaking text-danger"></div>
              </div>
              <div>
                <label>Listening:</label>
                <input type="text" name="listening" onChange={handleChange} className="listening border border-current  h-9 p-2" />
                <div className="error-field-listening text-danger"></div>
              </div>
              <div>
                <label>Reading:</label>
                <input type="text" name="reading" onChange={handleChange} className="reading border border-current  h-9 p-2" />
                <div className="error-field-reading text-danger"></div>
              </div>
              <div>
                <label>Writing:</label>
                <input type="text" name="writing" onChange={handleChange} className="writing border border-current  h-9 p-2" />
                <div className="error-field-writing text-danger"></div>
              </div>

            </div> : formData.examType == "TOFEL" ? <div>
              <label>Tofel Score:</label>
              <input type="text" name="tofel_score" onChange={handleChange} className="writing border border-current  h-9 p-2" />
              <div className="error-field-tofel_score text-danger"></div>
            </div> : formData.examType == "PTE" ? <div>

              <label>Pte Score:</label>
              <input type="text" name="pte_score" onChange={handleChange} className="writing border border-current  h-9 p-2" />
              <div className="error-field-pte_score text-danger"></div>
            </div> : <></>

        }

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
          <button
            className={`bg-[#1c3479] hover:bg-[#1c3479e0] mt-3 text-white font-bold py-2 m-1 px-10 text-lg rounded-full ${false ? "cursor-not-allowed opacity-50" : ""
              }`}
            onClick={handleNextExam}
          >
            Next
          </button>
        </div>

      </Accordion.Content>

      <Accordion.Title
        active={state.activeIndex === 2}
        index={2}
        className={`flex items-center mb-0 pb-0 ${state.activeIndex != 2 ? "hidden" : ""}`}
      >
        <Icon name="dropdown" />
        <h2 className="px-4 py-4  text-white m-0 w-full">
          What disciplines do you want to study? ((or leave blank to see
          everything))
        </h2>
      </Accordion.Title>
      <Accordion.Content active={state.activeIndex === 2}
        className={`${state.activeIndex != 2 ? "hidden" : ""}`}
      >
        <div className="bg-gray-200 p-5">
          <div className="lg:flex gap-4">
            <div>
              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["Engineering", "Technology", "Skill Trades", "Transportation"])} />
                <p className="m-0">Engineering and Technology , Skill Trades, Transportation</p>
              </div>

              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["Science"])} />
                <p className="m-0">Science</p>
              </div>

              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["Arts", "Media", "Design"])} />
                <p className="m-0">Arts, Media & Design</p>
              </div>

              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["Law", "Politics", "Community Service", "Education"])} />
                <p className="m-0">Law, Politics, Community Service, Education</p>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["Business", "Management", "Economics", "Administration", "Accounting"])} />
                <p className="m-0">Business, Management, Economics, Administration, Accounting</p>
              </div>

              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["English For Academic Studies"])} />
                <p className="m-0">English for Academic Studies</p>
              </div>

              <div className="flex items-center mb-2">
                <input className="mr-2" type="checkbox" onChange={() => handleNewStream(["Health Sciences", "Medicine", "Nursing", "Paramedic"])} />
                <p className="m-0"> Health Sciences, Medicine, Nursing, Paramedic
                </p>
              </div>


            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button class="bg-[#1c3479] hover:bg-[#1c3479e0] text-white font-bold py-3 px-6 rounded-full">
              Back
            </button>

            <button class="bg-[#1c3479] hover:bg-[#1c3479e0] text-white font-bold py-3 px-6 rounded-full ml-2" onClick={searchNow}>
              Show All Eligible Programs
            </button>
          </div>
        </div>
      </Accordion.Content>
    </Accordion>
  );
}


export default AccordionExampleStandard;