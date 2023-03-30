import axios from "axios";
import { useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import AgentDashboard from "../Screens/Dashboard/AgentDashboard";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

const AgentAddStudent = () => {
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)

    const [state, setState] = useState({
        submitProcessing: false,
        agentToken: getToken("agent"),
        accountInfo: {},
        academicInfo: {}
    })

    const RegisterNow = async (values) => {
        let apiData = {
            ...state.accountInfo,
            ...state.academicInfo
        }
        setState({
            ...state,
            submitProcessing: true,
        });
        const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }

        axios
            .post(process.env.REACT_APP_NODE_URL + "/agent/addstudent", apiData, config)
            .then((res) => {
                console.log({ register: res });
                alert(res.data.message);
                if (res.data.status == "0") {
                    setState({
                        ...state,
                        submitProcessing: false,
                    });
                    return;
                }
                navigate("/d/agent/getstudents")
            })
            .catch((err) => {
                console.log(err.response.data);
                if (err.response.data.name == "ValidationError") {
                    let errors = err.response.data.details.error;
                    let msg = "";
                    for (const key in errors) {
                        msg += errors[key] += "\n";
                        console.log([key, errors[key]]);
                    }
                    alert(msg);
                    return;
                }
                alert(err.response.data.message);
            });
    };



    const ValidationSchema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        phone: Yup.string()
            .min(10, "Phone must be 10 character at minimum")
            .required("Phone is required"),
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
    });

    const ValidationSchemaAcademic = Yup.object().shape({
        highestEducation: Yup.string().required("This Field is required"),
        gradeScore: Yup.string().required("This Field is required"),
        examType: Yup.string().required("This Field is required"),

        pteScore: Yup.string().when('examType', {
            is: (exam) => exam === 'PTE',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        tofelScore: Yup.string().when('examType', {
            is: (exam) => exam === 'TOFEL',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        readingScore: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        listeningScore: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        writingScore: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
        speakingScore: Yup.string().when('examType', {
            is: (exam) => exam === 'IELTS',
            then: Yup.string().required("This Field is required"),
            otherwise: Yup.string(),
        }),
    });


    const handleInput = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    return (
        <>
            <div>
                <>
                    <div className="row">
                        <div className="">
                            <div className="card card-plain studentAddForm">
                                <div className="card-header pb-0 text-left bg-transparent">
                                    {/* <h3 className="font-weight-bolder text-info text-gradient">Add Student</h3> */}
                                    {/* <p className="mb-0">Enter your email and password to register</p> */}
                                </div>
                                <div className="tab-list">
                                    <div onClick={() => null} className={`tab ${tab == 0 && "active"}`}>Account Information</div>
                                    <div onClick={() => null} className={`tab ${tab == 1 && "active"}`}>Academic Information</div>
                                    <div onClick={() => null} className={`tab ${tab == 2 && "active"}`}>Terms & Conditions</div>
                                </div>
                                <div className="card-body w-8/12 m-auto">
                                    <div className={`tab-content ${tab == 0 && "active"}`}>
                                        <Formik
                                            initialValues={{
                                                firstName: "",
                                                lastName: "",
                                                email: "",
                                                phone: "",
                                            }}
                                            validationSchema={ValidationSchema}
                                            onSubmit={(values) => {
                                                setState({
                                                    ...state,
                                                    accountInfo: values
                                                })
                                                setTab(1)
                                                // alert("Form is validated and in this block api call should be made...");
                                            }}
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
                                                        <div className="flex">
                                                            <div className="m-2 w-6/12">
                                                                <label>First Name</label>
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
                                                                <label>Last Name</label>
                                                                <Field
                                                                    type="text"
                                                                    className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.lastName && errors.lastName
                                                                        ? "is-invalid"
                                                                        : ""
                                                                        }`}
                                                                    placeholder="Last Name"
                                                                    aria-label="lastName"
                                                                    aria-describedby="lastName-addon"
                                                                    name="lastName"
                                                                />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="lastName"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="m-2">
                                                            <label>Phone</label>
                                                            <Field
                                                                type="text"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.phone && errors.phone
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="Phone"
                                                                aria-label="Phone"
                                                                aria-describedby="phone-addon"
                                                                name="phone"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="phone"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="m-2">
                                                            <label>Email</label>
                                                            <Field
                                                                type="email"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                placeholder="Email"
                                                                aria-label="Email"
                                                                aria-describedby="email-addon"
                                                                name="email"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="email"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="w-full p-[10px] flex justify-end">

                                                            <ButtonPrimary
                                                                title={"Next"}
                                                                loading={state.submitProcessing}
                                                                type="submit"
                                                            // onclick={()=>setTab(tab + 1)}
                                                            />
                                                            {/* <button type="submit" className="bg-gradient-primary text-white px-4 py-1 mt-4 mb-0 text-white rounded-full">Register</button> */}
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </div>
                                    <div className={`tab-content ${tab == 1 && "active"}`}>
                                        <Formik
                                            initialValues={{
                                                highestEducation: "",
                                                gradeScore: "",
                                                examType: "",
                                                pteScore: "",
                                                tofelScore: "",
                                                readingScore: "",
                                                listeningScore: "",
                                                writingScore: "",
                                                speakingScore: "",
                                            }}
                                            validationSchema={ValidationSchemaAcademic}
                                            onSubmit={(values) => {
                                                setState({
                                                    ...state,
                                                    academicInfo: values
                                                })
                                                setTab(2)
                                            }}
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
                                                                <label>Grade Score</label>
                                                                <Field
                                                                    type="text"
                                                                    className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.lastName && errors.lastName
                                                                        ? "is-invalid"
                                                                        : ""
                                                                        }`}
                                                                    placeholder="Grade Score"
                                                                    name="gradeScore"
                                                                />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="gradeScore"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
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
                                                                        type="tofelScore"
                                                                        className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.tofelScore && errors.tofelScore
                                                                            ? "is-invalid"
                                                                            : ""
                                                                            }`}
                                                                        placeholder="Tofel Score"
                                                                        name="tofelScore"
                                                                    />
                                                                    <ErrorMessage
                                                                        component="div"
                                                                        name="tofelScore"
                                                                        className="invalid-feedback"
                                                                    />
                                                                </div> :
                                                                values.examType == "PTE" ?
                                                                    <div className="m-2">
                                                                        <label>PTE Score</label>
                                                                        <Field
                                                                            type="pteScore"
                                                                            className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.pteScore && errors.pteScore
                                                                                ? "is-invalid"
                                                                                : ""
                                                                                }`}
                                                                            placeholder="Pte Score"
                                                                            name="pteScore"
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name="pteScore"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </div> : values.examType == "IELTS" && <div className="flex w-full">
                                                                        <div className="m-2 w-3/12">
                                                                            <label>Reading</label>
                                                                            <Field
                                                                                type="readingScore"
                                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.readingScore && errors.readingScore
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                    }`}
                                                                                placeholder="Reading Score"
                                                                                name="readingScore"
                                                                            />
                                                                            <ErrorMessage
                                                                                component="div"
                                                                                name="readingScore"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="m-2 w-3/12">
                                                                            <label>Listening</label>
                                                                            <Field
                                                                                type="listeningScore"
                                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.listeningScore && errors.listeningScore
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                    }`}
                                                                                placeholder="Listening Score"
                                                                                name="listeningScore"
                                                                            />
                                                                            <ErrorMessage
                                                                                component="div"
                                                                                name="listeningScore"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="m-2 w-3/12">
                                                                            <label>Writing Score</label>
                                                                            <Field
                                                                                type="writingScore"
                                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.writingScore && errors.writingScore
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                    }`}
                                                                                placeholder="Writing Score"
                                                                                name="writingScore"
                                                                            />
                                                                            <ErrorMessage
                                                                                component="div"
                                                                                name="writingScore"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="m-2 w-3/12">
                                                                            <label>Speaking Score</label>
                                                                            <Field
                                                                                type="speakingScore"
                                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.speakingScore && errors.speakingScore
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                    }`}
                                                                                placeholder="Speaking Score"
                                                                                name="speakingScore"
                                                                            />
                                                                            <ErrorMessage
                                                                                component="div"
                                                                                name="speakingScore"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                        }

                                                        <div className="w-full p-[10px] flex justify-end">
                                                            <div className="m-2">
                                                                <ButtonPrimary
                                                                    title={"Back"}
                                                                    loading={state.submitProcessing}
                                                                    type="button"
                                                                    onclick={() => setTab(tab - 1)}
                                                                />
                                                            </div>
                                                            <div className="m-2">
                                                                <ButtonPrimary
                                                                    title={"Next"}
                                                                    loading={state.submitProcessing}
                                                                    type="submit"
                                                                    className="m-2"
                                                                // onclick={()=>setTab(tab + 1)}
                                                                />
                                                            </div>
                                                            {/* <button type="submit" className="bg-gradient-primary text-white px-4 py-1 mt-4 mb-0 text-white rounded-full">Register</button> */}
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </div>
                                    <div className={`tab-content ${tab == 2 && "active"}`}>
                                        <div className="m-auto">

                                            <p className="m-2">
                                                Welcome to Learn International!These Terms and conditions of Learn International are only for your benefit because your agreement is very important while applying through our services.
                                                If you have any questions or concerns about the terms of this agreement, please contact us.
                                            </p>

                                            <h1 className="font-black m-2">1. What we request you to perform</h1>
                                            <p className="m-2">
                                                You concur that :

                                                The information filled by me in the registration form; correct and absolutely to the best of my understanding.
                                                I am being counseled to learn International, on all aspects of my international education and on my future career prospects.
                                                I never apply to any Universities or Colleges directly on my own.
                                                All the qualification form, that I have submitted in my application are genuine and valid.
                                                My personal information may be processed in any college or school form for admission purposes.
                                                You admit that you are only dependable for the completeness, correctness, and faithfulness of all information that you bestow to usYou understand that all the work done by Learn International is only for the development of your future.You must aware that if the minutiae on this form are not completed and real, your application may not be processed.
                                            </p>

                                            <h1 className="font-black m-2">
                                                2. Your Privacy
                                            </h1>

                                            <p className="m-2">
                                                Your privacy is appreciated by us. The information, including sensitive information about your country, qualification, that you provide to us will only be supplied to the people or organizations for the specific reason.
                                                You agree that we can invite any academic institution (and if requested, that you will instruct that institution) to which you are accepted, to send us information about when you originate a preliminary and any subsequent course of study with that institution.
                                                You understand that if you don't contribute all of the information we ask from you, we may not be able to process your applications.
                                                You specifically agree that Learn International may reveal your name, address, e-mail address and your educational information to the Institutions.
                                                If at any time after we have sent your application forms to the academic institutions you have chosen, you wish to confirm the information, you will need to contact the relevant institutions directly.
                                            </p>

                                            <h1 className="font-black m-2">
                                                3. Our Liability
                                            </h1>

                                            <p className="m-2">
                                                You admit that we are not responsible for the result of the institute. We have no control over the college or school to accept or reject your application.
                                                We cannot give you any guarantee that particular institute gives you admission.
                                                We cannot assure that the website used to submit your applications will run error-free, or that the website and its server are free of PC viruses or other harmful mechanisms.
                                                We are not responsible for the stoppage of any institution to consider your application quickly, properly or at all.
                                            </p>

                                            <h1 className="font-black m-2">4. Refund Policy</h1>
                                            <p className="m-2">
                                                We tend to notify you that all services presented by Learn International are on non-refundable. You admit that a certain amount of fee is set by the organization and that Learn International has no control over the fee refund.
                                            </p>

                                            <h1 className="font-black m-2">
                                                5. Acceptance
                                            </h1>

                                            <p className="m-2">
                                                I agree by the terms and conditions contained on this form, and I give the permission which has been required in this form, as well as consent to contract with my private information in the ways described in this form.
                                            </p>

                                        </div>
                                        <div className="w-full p-[10px] flex justify-end">
                                            <div className="m-2">
                                                <ButtonPrimary
                                                    title={"Back"}
                                                    loading={state.submitProcessing}
                                                    type="button"
                                                    onclick={() => setTab(tab - 1)}
                                                />
                                            </div>
                                            <div className="m-2">
                                                <ButtonPrimary
                                                    title={"Register"}
                                                    loading={state.submitProcessing}
                                                    type="submit"
                                                    className="m-2"
                                                    onclick={() => RegisterNow()}
                                                />
                                            </div>
                                            {/* <button type="submit" className="bg-gradient-primary text-white px-4 py-1 mt-4 mb-0 text-white rounded-full">Register</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    )
}

export default AgentAddStudent;