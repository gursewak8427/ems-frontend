import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import AgentDashboard from "../Screens/Dashboard/AgentDashboard";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

const AgentFindProgram = () => {
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)

    const [state, setState] = useState({
        agentToken: getToken("agent"),
        countryList: [],
        isWait: true,
    })


    const handleInput = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }


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

    const ValidationSchema = Yup.object().shape({
        firstName: Yup.string().required("Student First Name is required"),
        lastName: Yup.string().required("Student Last Name is required"),
        phone: Yup.string().required("Phone is required"),
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
        highestEducation: Yup.string().required("This Field is required"),
        gradeAverage: Yup.string().required("This Field is required"),
        country_to_go: Yup.string().required("This Field is required"),
        examType: Yup.string().required("This Field is required"),
        pte_score: Yup.string().when('examType', {
            is: (exam) => exam === 'PTE',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        tofel_score: Yup.string().when('examType', {
            is: (exam) => exam === 'TOFEL',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        reading: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        listening: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        writing: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        speaking: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
    });

    const searchNow = async values => {
        var api_data = {
            "first_name": values.firstName,
            "last_name": values.lastName,
            "email": values.email,
            "phone": values.phone,
            "highest_education": values.highestEducation,
            "highest_education": values.highestEducation,
            "country_to_go": values.country_to_go,
            "exam": {
                "type": values.examType,
                "score": values.examType == "IELTS" ? [
                    parseFloat(values.writing),
                    parseFloat(values.reading),
                    parseFloat(values.speaking),
                    parseFloat(values.listening)
                ] : values.examType == "PTE" ? parseFloat(values.pte_score) : values.examType == "TOFEL" ? parseFloat(values.tofel_score) : 0
            },
            "grade_score": parseFloat(values.gradeAverage)
        }
        var jsondata = JSON.stringify(api_data);
        // await uploadQueryNow()
        navigate("/d/agent/findprograms/search/" + jsondata)
    }

    return (
        <>
            <div>
                <>
                    <div className="row">
                        <div className="">
                            <div className="card card-plain studentFindPrograms p-[10px]">
                                <h1 className="font-black text-lg">Find Programs</h1>

                                <Formik
                                    initialValues={{
                                        firstName: "",
                                        lastName: "",
                                        email: "",
                                        phone: "",
                                        highestEducation: "",
                                        gradeAverage: "",
                                        country_to_go: "",
                                        examType: "",
                                        tofel_score: "",
                                        pte_score: "",
                                        speaking: "",
                                        listening: "",
                                        writing: "",
                                        reading: "",
                                    }}
                                    validationSchema={ValidationSchema}
                                    onSubmit={searchNow}
                                >
                                    {({ touched, errors, isSubmitting, values }) => {
                                        {
                                            console.log({
                                                touched,
                                                errors,
                                                isSubmitting,
                                                values,
                                            });
                                        }
                                        return (
                                            <Form>
                                                <div className="border-2 my-2 p-4">
                                                    <h1>Basic Information</h1>
                                                    <div className="flex">
                                                        <div className="m-2 w-6/12">
                                                            <Field
                                                                type="text"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.firstName && errors.firstName
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="First Name"
                                                                aria-label="firstName"
                                                                aria-describedby="firstName-addon"
                                                                name="firstName"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="firstName"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <Field
                                                                type="text"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.lastName && errors.lastName
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="Last Name"
                                                                name="lastName"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="lastName"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="m-2 w-6/12">
                                                            <Field
                                                                type="text"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.phone && errors.phone
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="Phone"
                                                                aria-label="phone"
                                                                name="phone"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="phone"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <Field
                                                                type="text"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="Email"
                                                                name="email"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="email"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-2 my-2 p-4">
                                                    <h1>Qualification Details</h1>
                                                    <div className="flex">
                                                        <div className="m-2 w-6/12">
                                                            <label>Highest Education</label>
                                                            <Field
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.highestEducation && errors.highestEducation
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                name="highestEducation"
                                                                as="select"
                                                            >
                                                                {values.highestEducation == "" ? <option value="" selected>--Select--</option> : <option value="" selected>--Select--</option>}
                                                                {values.highestEducation == "secondary" ? <option selected value="secondary">Grade 12/High School</option> : <option value="secondary">Grade 12/High School</option>}
                                                                {values.highestEducation == "certificate" ? <option selected value="certificate">1-Year Post-Secondary Certificate</option> : <option value="certificate">1-Year Post-Secondary Certificate</option>}
                                                                {values.highestEducation == "diploma" ? <option selected value="diploma">2-Year Undergraduate Diploma</option> : <option value="diploma">2-Year Undergraduate Diploma</option>}
                                                                {values.highestEducation == "advance_diploma" ? <option selected value="advance_diploma">3-Year Undergraduate Advanced Diploma</option> : <option value="advance_diploma">3-Year Undergraduate Advanced Diploma</option>}
                                                                {values.highestEducation == "3_year_bachlor" ? <option selected value="3_year_bachlor">3-Year Bachelor's Degree</option> : <option value="3_year_bachlor">3-Year Bachelor's Degree</option>}
                                                                {values.highestEducation == "4_year_bachlor" ? <option selected value="4_year_bachlor">4-Year Bachelor's Degree</option> : <option value="4_year_bachlor">4-Year Bachelor's Degree</option>}
                                                                {values.highestEducation == "postgraduate_diploma" ? <option selected value="postgraduate_diploma">Postgraduate Certificate/Diploma</option> : <option value="postgraduate_diploma">Postgraduate Certificate/Diploma</option>}
                                                                {values.highestEducation == "master" ? <option selected value="master">Master's Degree</option> : <option value="master">Master's Degree</option>}
                                                                {values.highestEducation == "doctrate" ? <option selected value="doctrate">Doctoral Degree (Phd, M.D., ...)</option> : <option value="doctrate">Doctoral Degree (Phd, M.D., ...)</option>}
                                                            </Field>
                                                            <ErrorMessage
                                                                component="div"
                                                                name="highestEducation"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <label>Grade Average</label>
                                                            <Field
                                                                type="text"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.gradeAverage && errors.gradeAverage
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="Grade Score"
                                                                name="gradeAverage"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="gradeAverage"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="m-2">
                                                        <label>Destination Country</label>
                                                        <Field
                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.country_to_go && errors.country_to_go
                                                                ? "is-invalid"
                                                                : ""
                                                                }`}
                                                            name="country_to_go"
                                                            as="select"
                                                        >
                                                            <option value="">--Select--</option>
                                                            {state.countryList.map((country) => {
                                                                return <option value={country.countryId}>{country.countryName}</option>;
                                                            })}
                                                        </Field>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="country_to_go"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="m-2">
                                                        <label>Exam Type</label>
                                                        <Field
                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.examType && errors.examType
                                                                ? "is-invalid"
                                                                : ""
                                                                }`}
                                                            name="examType"
                                                            as="select"
                                                        >
                                                            <option value="">--Select--</option>
                                                            <option value="IELTS">IELTS</option>
                                                            <option value="TOFEL">TOFEL</option>
                                                            <option value="PTE">PTE</option>
                                                        </Field>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="examType"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>

                                                    {
                                                        values.examType == "TOFEL" ?
                                                            <div className="m-2">
                                                                <label>TOFEL Score</label>
                                                                <Field
                                                                    type="tofel_score"
                                                                    className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.tofel_score && errors.tofel_score
                                                                        ? "is-invalid"
                                                                        : ""
                                                                        }`}
                                                                    placeholder="Tofel Score"
                                                                    name="tofel_score"
                                                                />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="tofel_score"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div> :
                                                            values.examType == "PTE" ?
                                                                <div className="m-2">
                                                                    <label>PTE Score</label>
                                                                    <Field
                                                                        type="pte_score"
                                                                        className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.pte_score && errors.pte_score
                                                                            ? "is-invalid"
                                                                            : ""
                                                                            }`}
                                                                        placeholder="Pte Score"
                                                                        name="pte_score"
                                                                    />
                                                                    <ErrorMessage
                                                                        component="div"
                                                                        name="pte_score"
                                                                        className="invalid-feedback"
                                                                    />
                                                                </div> : values.examType == "IELTS" && <div className="flex w-full">
                                                                    <div className="m-2 w-3/12">
                                                                        <label>Reading</label>
                                                                        <Field
                                                                            type="reading"
                                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.reading && errors.reading
                                                                                ? "is-invalid"
                                                                                : ""
                                                                                }`}
                                                                            placeholder="Reading Score"
                                                                            name="reading"
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name="reading"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </div>
                                                                    <div className="m-2 w-3/12">
                                                                        <label>Listening</label>
                                                                        <Field
                                                                            type="listening"
                                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.listening && errors.listening
                                                                                ? "is-invalid"
                                                                                : ""
                                                                                }`}
                                                                            placeholder="Listening Score"
                                                                            name="listening"
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name="listening"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </div>
                                                                    <div className="m-2 w-3/12">
                                                                        <label>Writing Score</label>
                                                                        <Field
                                                                            type="writing"
                                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.writing && errors.writing
                                                                                ? "is-invalid"
                                                                                : ""
                                                                                }`}
                                                                            placeholder="Writing Score"
                                                                            name="writing"
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name="writing"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </div>
                                                                    <div className="m-2 w-3/12">
                                                                        <label>Speaking Score</label>
                                                                        <Field
                                                                            type="speaking"
                                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.speaking && errors.speaking
                                                                                ? "is-invalid"
                                                                                : ""
                                                                                }`}
                                                                            placeholder="Speaking Score"
                                                                            name="speaking"
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name="speaking"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </div>
                                                                </div>
                                                    }
                                                    <div className="m-2 justify-end flex mt-4">
                                                        <ButtonPrimary title={"Search"} type="submit" />
                                                    </div>
                                                </div>
                                            </Form>
                                        );
                                    }}
                                </Formik>


                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    )
}

export default AgentFindProgram;