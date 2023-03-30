import axios from "axios";
import React, { useEffect, useState } from "react";
import MultiStep from "react-multistep";
import { useNavigate } from "react-router-dom";

export default function MultiStepForm() {
  const navigate = useNavigate()
  const [state, setState] = useState({
    stepNumber: 0,
    iswait: true,
    countryList: []
  });



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
    document.getElementById("header_menu").classList.remove("header-part");
    document.getElementById("header_menu").classList.add("static-header");
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


  const setStep = (number) => {
    setState({
      ...state,
      stepNumber: number,
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

  const searchNow = async () => {
    let errors = getErrorsExam()
    if (errors) return;

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
    await uploadQueryNow()
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
      examType: formData.examType,
      scores: formData.examType == "IELTS" ? [
        parseFloat(formData.writing),
        parseFloat(formData.reading),
        parseFloat(formData.speaking),
        parseFloat(formData.listening)
      ] : formData.examType == "PTE" ?
        parseFloat(formData.pte_score) : formData.examType == "TOFEL" ?
          parseFloat(formData.tofel_score) : 0,
      created: Date.now(),
    }
    axios.post(`${process.env.REACT_APP_NODE_URL}/student/fillsearchqueries`, api_data).then(response => {
      console.log(response)
    });
  }


  const handleChange = event => {
    if (event.target.name == "nationality") {
      if (event.target.value != "") {
        setStep(1)
      }
    }
    if (event.target.name == "highestEducation") {
      if (event.target.value != "") {
        setStep(2)
      }
    }
    if (event.target.name == "gradingScheme") {
      if (event.target.value != "") {
        setStep(3)
      }
    }
    if (event.target.name == "country_to_go") {
      if (event.target.value != "") {
        setStep(8)
      }
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };

  const handleNext = (index) => {
  }


  if (state.iswait) {
    return "Loading..."
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="multi-form mx-auto rounded my-14">
          {/* <MultiStep activeStep={1} showNavigation={true} steps={steps} /> */}

          {
            state.stepNumber == 0 ?
              <>
                <div>
                  <label>Nationality</label>
                  <div className="m-4">

                    <select
                      className="border rounded-lg w-full p-2"
                      name="nationality"
                      id="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      {state.countryList.map((country) => {
                        if (formData.nationality == country.countryId)
                          return <option value={country.countryId} selected>{country.countryName}</option>;
                        else
                          return <option value={country.countryId}>{country.countryName}</option>;
                      })}
                    </select>
                    <div className="error-field-nationality text-[red] mt-1"></div>

                    <div className="flex justify-end">
                      {/* 
                    <button onClick={
                      setStep(0)
                    }>Back</button> */}

                      <button onClick={false ? null : () => {
                        if (formData.nationality == "") {
                          // document.getElementById("nationality").style.borderWidth = "1px"
                          // document.getElementById("nationality").style.borderStyle = "solid"
                          document.getElementById("nationality").style.borderColor = "red"
                          // document.getElementsByClassName("error-field-nationality")[0].innerText = "Nationality is required"
                          // alert("Nationality is required")
                        } else {
                          setStep(1)
                        }
                      }}>Next</button>
                    </div>
                  </div>
                </div>
              </> :
              state.stepNumber == 1 ?
                <>
                  <label>Highest Education*</label>
                  <div className="m-4">
                    <select
                      className="border rounded-lg w-full p-2"
                      name="highestEducation"
                      id="highestEducation"
                      value={formData.highestEducation}
                      onChange={handleChange}
                    >
                      {formData.highestEducation == "" ? <option value="" selected>--Select--</option> : <option value="" selected>--Select--</option>}
                      {formData.highestEducation == "secondary" ? <option selected value="secondary">Grade 12/High School</option> : <option value="secondary">Grade 12/High School</option>}
                      {formData.highestEducation == "certificate" ? <option selected value="certificate">1-Year Post-Secondary Certificate</option> : <option value="certificate">1-Year Post-Secondary Certificate</option>}
                      {formData.highestEducation == "diploma" ? <option selected value="diploma">2-Year Undergraduate Diploma</option> : <option value="diploma">2-Year Undergraduate Diploma</option>}
                      {formData.highestEducation == "advance_diploma" ? <option selected value="advance_diploma">3-Year Undergraduate Advanced Diploma</option> : <option value="advance_diploma">3-Year Undergraduate Advanced Diploma</option>}
                      {formData.highestEducation == "3_year_bachlor" ? <option selected value="3_year_bachlor">3-Year Bachelor's Degree</option> : <option value="3_year_bachlor">3-Year Bachelor's Degree</option>}
                      {formData.highestEducation == "4_year_bachlor" ? <option selected value="4_year_bachlor">4-Year Bachelor's Degree</option> : <option value="4_year_bachlor">4-Year Bachelor's Degree</option>}
                      {formData.highestEducation == "postgraduate_diploma" ? <option selected value="postgraduate_diploma">Postgraduate Certificate/Diploma</option> : <option value="postgraduate_diploma">Postgraduate Certificate/Diploma</option>}
                      {formData.highestEducation == "master" ? <option selected value="master">Master's Degree</option> : <option value="master">Master's Degree</option>}
                      {formData.highestEducation == "doctrate" ? <option selected value="doctrate">Doctoral Degree (Phd, M.D., ...)</option> : <option value="doctrate">Doctoral Degree (Phd, M.D., ...)</option>}
                    </select>

                    <div className="error-field-highestEducation text-[red] mt-1"></div>

                    <div className="flex justify-between">

                      <button onClick={() => setStep(0)}>Back</button>

                      <button onClick={false ? null : () => {
                        if (formData.highestEducation == "") {
                          // alert("Highest Education is required")
                          document.getElementById("highestEducation").style.borderColor = "red"
                          // document.getElementsByClassName("error-field-highestEducation")[0].innerText = "Highest Education is required"

                        } else {
                          setStep(2)
                          document.getElementById("gradingScheme").style.borderColor = "grey"
                          // document.getElementsByClassName("error-field-gradingScheme")[0].innerText = ""

                        }
                      }}>Next</button>
                    </div>
                  </div>
                </> :
                state.stepNumber == 2 ?
                  <>
                    <label>Grading Scheme*</label>
                    <div className="m-4">
                      <select className="border rounded-lg w-full p-2" name="gradingScheme"
                        id="gradingScheme"
                        value={formData.gradingScheme}
                        onChange={handleChange}>
                          {
                            formData.gradingScheme == "" ? <option value="" selected>--Select--</option> : <option value="">--Select--</option>
                          }
                          {
                            formData.gradingScheme == "secondary_level" ? <option value="secondary_level" selected>Secondary Level - Scale: 0-100</option> : <option value="secondary_level">Secondary Level - Scale: 0-100</option>
                          }
                      </select>
                      <div className="error-field-gradingScheme text-[red] mt-1"></div>
                      <div className="flex justify-between">

                        <button onClick={() => setStep(1)}>Back</button>

                        <button onClick={() => {
                          if (formData.gradingScheme == "") {
                            // alert("Grading Scheme is required")
                            document.getElementById("gradingScheme").style.borderColor = "red"
                            // document.getElementsByClassName("error-field-gradingScheme")[0].innerText = "Grading Scheme is required"
                          } else {
                            setStep(3)
                            document.getElementById("Average").style.borderColor = "white"
                            document.getElementsByClassName("error-field-Average")[0].innerText = ""

                          }
                        }}>Next</button>
                      </div>
                    </div>
                  </> :
                  state.stepNumber == 3 ?
                    <>
                      <label>Grade Average</label>
                      <div className="m-4">
                        <input className="w-full p-2 border rounded-lg" type="text" name="gradeAverage"
                          value={formData.gradeAverage}
                          id="gradeAverage"
                          placeholder="Enter Grade Average"
                          onChange={handleChange} />
                        <div className="error-field-gradeAverage text-[red] mt-1"></div>
                        <div className="flex justify-between">

                          <button onClick={() => setStep(2)}>Back</button>

                          <button onClick={() => {
                            if (formData.gradeAverage == "") {
                              // alert("Grade Average is required")
                              document.getElementById("gradeAverage").style.borderColor = "red"
                              // document.getElementsByClassName("error-field-gradeAverage")[0].innerText = "Grade Average is required"

                            } else {
                              setStep(4)
                              document.getElementById("name").style.borderColor = "white"
                              // document.getElementsByClassName("error-field-name")[0].innerText = "Highest Education is required"

                            }
                          }}>Next</button>
                        </div>
                      </div>

                    </> :
                    state.stepNumber == 4 ?
                      <>
                        <label>Name*</label>
                        <div className="m-4">
                          <input
                            className="border w-full rounded-lg p-2"
                            type="text"
                            name="name"
                            key={"4"}
                            id="name"
                            value={formData.name}
                            placeholder="Enter Name"
                            onChange={handleChange}
                          />
                          <div className="error-field-name text-[red] mt-1"></div>
                          <div className="flex justify-between">

                            <button onClick={() => setStep(3)}>Back</button>

                            <button onClick={() => {
                              if (formData.name == "") {
                                // alert("Name is required")
                                document.getElementById("name").style.borderColor = "red"
                                // document.getElementsByClassName("error-field-name")[0].innerText = "Name is required"
                              } else {
                                setStep(5)
                                document.getElementById("phoneNumber").style.borderColor = "white"
                                // document.getElementsByClassName("error-field-phoneNumber")[0].innerText = "Highest Education is required"

                              }
                            }}>Next</button>
                          </div>
                        </div>

                      </> :
                      state.stepNumber == 5 ?
                        <>
                          <label>Phone Number*</label>
                          <div className="m-4">
                            <input
                              key={"5"}
                              className="border w-full rounded-lg p-2"
                              type="phone"
                              name="phoneNumber"
                              id="phoneNumber"
                              value={formData.phoneNumber}
                              placeholder="Enter Phone"
                              onChange={handleChange}
                            />
                            <div className="error-field-phoneNumber text-[red] mt-1"></div>
                            <div className="flex justify-between">

                              <button onClick={() => setStep(4)}>Back</button>

                              <button onClick={() => {
                                if (formData.phoneNumber == "") {
                                  // alert("Phone is required")
                                  document.getElementById("phoneNumber").style.borderColor = "red"
                                  // document.getElementsByClassName("error-field-phoneNumber")[0].innerText = "Phone Number is required"

                                } else {
                                  setStep(6)
                                  document.getElementById("email").style.borderColor = "white"
                                  // document.getElementsByClassName("error-field-email")[0].innerText = "Highest Education is required"

                                }
                              }}>Next</button>
                            </div>
                          </div>
                        </> :
                        state.stepNumber == 6 ?
                          <>
                            <label>Email*</label>
                            <div className="m-4">
                              <input
                                className="border w-full rounded-lg p-2"
                                type="email"
                                name="email"
                                value={formData.email}
                                id="email"
                                placeholder="Enter Email"
                                onChange={handleChange}
                              />

                              <div className="error-field-email text-[red] mt-1"></div>
                              <div className="flex justify-between">

                                <button onClick={() => setStep(5)}>Back</button>

                                <button onClick={() => {
                                  if (formData.email == "") {
                                    // alert("Email is required")
                                    document.getElementById("email").style.borderColor = "red"
                                    // document.getElementsByClassName("error-field-phoneNumber")[0].innerText = "Email is required"

                                  } else {
                                    setStep(7)
                                    document.getElementById("country_to_go").style.borderColor = "white"
                                    // document.getElementsByClassName("error-field-country_to_go")[0].innerText = "Highest Education is required"

                                  }
                                }}>Next</button>
                              </div>
                            </div>

                          </> :
                          state.stepNumber == 7 ?
                            <>
                              <label>Where you want to go*</label>
                              <div className="m-4">
                                <select
                                  className="border rounded-lg w-full p-2"
                                  name="country_to_go"
                                  id="country_to_go"
                                  onChange={handleChange}
                                  value={formData.country_to_go}
                                >
                                  <option value="">--Select--</option>
                                  {state.countryList.map((country) => {
                                    return <option value={country.countryId}>{country.countryName}</option>;
                                  })}
                                </select>

                                <div className="error-field-country_to_go text-[red] mt-1"></div>
                                <div className="flex justify-between">

                                  <button onClick={() => setStep(6)}>Back</button>

                                  <button onClick={() => {
                                    if (formData.country_to_go == "") {

                                      document.getElementById("country_to_go").style.borderColor = "red"
                                      // document.getElementsByClassName("error-field-country_to_go")[0].innerText = "Destination Country is required"

                                      // alert("Destination Country is required")
                                    } else {
                                      setStep(8)
                                      document.getElementById("examType").style.borderColor = "red"
                                      // document.getElementsByClassName("error-field-examType")[0].innerText = "Highest Education is required"

                                    }
                                  }}>Next</button>
                                </div>
                              </div>
                            </> : <>
                              <label>Exam:</label>
                              <div className="m-4">
                                <div>
                                  <select name="examType" className="w-full" onChange={handleChange} value={formData.examType}>
                                    <option value="">--SELECT--</option>
                                    <option value="TOFEL">TOFEL</option>
                                    <option value="IELTS">IELTS</option>
                                    <option value="PTE">PTE</option>
                                  </select>
                                  <div className="error-field-examType text-danger"></div>
                                </div>
                                {
                                  formData.examType == "IELTS" ?
                                    <div className="flex examLabels gap-4 red">
                                      <div>
                                        <label className="">Speaking:</label>
                                        <input type="text" value={formData.speaking} name="speaking" onChange={handleChange} className="speaking border border-current  h-9 p-2" />
                                        <div className="error-field-speaking text-danger"></div>
                                      </div>
                                      <div>
                                        <label>Listening:</label>
                                        <input type="text" value={formData.listening} name="listening" onChange={handleChange} className="listening border border-current  h-9 p-2" />
                                        <div className="error-field-listening text-danger"></div>
                                      </div>
                                      <div>
                                        <label>Reading:</label>
                                        <input type="text" value={formData.reading} name="reading" onChange={handleChange} className="reading border border-current  h-9 p-2" />
                                        <div className="error-field-reading text-danger"></div>
                                      </div>
                                      <div>
                                        <label>Writing:</label>
                                        <input type="text" value={formData.writing} name="writing" onChange={handleChange} className="writing border border-current  h-9 p-2" />
                                        <div className="error-field-writing text-danger"></div>
                                      </div>

                                    </div> : formData.examType == "TOFEL" ? <div className="examLabels">
                                      <label>Tofel Score:</label>
                                      <input type="text" name="tofel_score" value={formData.tofel_score} onChange={handleChange} className="writing border border-current  h-9 p-2 w-full" />
                                      <div className="error-field-tofel_score text-danger"></div>
                                    </div> : formData.examType == "PTE" ?
                                      <div className="examLabels">
                                        <label>Pte Score:</label>
                                        <input type="text" name="pte_score" value={formData.pte_score} onChange={handleChange} className="writing border border-current  h-9 p-2 w-full" />
                                        <div className="error-field-pte_score text-danger"></div>
                                      </div>
                                      : <></>
                                }


                                <div className="flex justify-between">
                                  <button onClick={() => setStep(7)}>Back</button>
                                  <button onClick={searchNow}>Search</button>
                                </div>
                              </div>
                            </>
          }

          {/* {steps.map((step, index) => {
            return (
              <div
                className={`singleStep ${state.stepNumber == index ? "active" : ""
                  }`}
              >
                {step.component}

                <div className="multistep-btn-parent d-flex justify-content-between align-items-center">
                  {index != 0 && (
                    <button onClick={() => handleNext(index - 1)}>Back</button>
                  )}
                  {steps.length != index + 1 && state.stepNumber == 3 ? (
                    <button onClick={() => handleNext(index + 1)}>Next</button>
                  ) : <></>}
                </div>

              </div>

            );
          })} */}
        </div>
      </div>
    </>
  );
}