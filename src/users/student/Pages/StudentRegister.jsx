import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AuthScreen from "../Screens/Authentication/StudentAuthScreen";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";

const StudentRegister = (props) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    submitProcessing: false,

    redirect: props.redirect,
    type: props.type,
    school: props.school,
    program: props.program,
  });

  const RegisterNow = async (values) => {
    setState({
      ...state,
      submitProcessing: true,
    });
    const { email, password, confirmPassword, firstName, lastName, phone } =
      values;
    if (password != confirmPassword)
      return alert("Both passwords should be same");
    const data = { email, password, firstName, lastName, phone };
    const config = { "content-type": "application/json" };

    axios
      .post(process.env.REACT_APP_NODE_URL + "/student/register", data)
      .then((res) => {
        console.log({ register: res });
        if (res.data.status == "0") {
          alert(res.data.message);
          setState({
            ...state,
            submitProcessing: false,
          });
          return;
        }
        if (state.redirect == "true") {
          window.location.href =
            "/d?user=student&redirect=true&type=enroll&school=" +
            state.school +
            "&program=" +
            state.program;
        } else {
          window.location.href = "/d?user=student";
        }
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
    password: Yup.string()
      .min(6, "Password must be 6 characters at minimum")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .min(6, "Confirm Password must be 6 characters at minimum")
      .required("Confirm Password is required"),
  });

  return (
    <>
      <AuthScreen>
        <>
          <div className="row">
            <div className="">
              <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-12/12">
                <div className="">
                  <div className="space-y-6 bg-white px-4 pb-5 pt-[20px] form-login">
                    <div className="">
                      <Formik
                        initialValues={{
                          email: "",
                          password: "",
                          firstName: "",
                          lastName: "",
                          phone: "",
                          confirmPassword: "",
                        }}
                        validationSchema={ValidationSchema}
                        onSubmit={(values) => {
                          console.log(values);
                          RegisterNow(values);
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
                                    className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                      touched.firstName && errors.firstName
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="firstName"
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
                                    className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                      touched.lastName && errors.lastName
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="lastName"
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
                                  className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                    touched.phone && errors.phone
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
                                  className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                    touched.email && errors.email
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

                              <div className="m-2">
                                <label>Password</label>
                                <Field
                                  type="password"
                                  className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                    touched.password && errors.password
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="Password"
                                  aria-label="Password"
                                  aria-describedby="password-addon"
                                  name="password"
                                />
                                <ErrorMessage
                                  component="div"
                                  name="password"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="m-2">
                                <label>Confrim password</label>
                                <Field
                                  type="password"
                                  className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                    touched.confirmPassword &&
                                    errors.confirmPassword
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="confirmPassword"
                                  aria-label="confirmPassword"
                                  aria-describedby="confirmPassword-addon"
                                  name="confirmPassword"
                                />
                                <ErrorMessage
                                  component="div"
                                  name="confirmPassword"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="text-center mt-5">
                                <ButtonPrimary
                                  title={"Register"}
                                  loading={state.submitProcessing}
                                  type="submit"
                                />
                                {/* <button type="submit" className="bg-gradient-primary text-white px-4 py-1 mt-4 mb-0 text-white rounded-full">Register</button> */}
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                    </div>
                    <div className="text-center pt-2 px-lg-2 px-1">
                      <p className="mb-4 text-sm mx-auto">
                        Already have an account?
                        <span
                          onClick={() => props.setPage(3)}
                          className="text-info text-gradient cursor-pointer font-bold"
                        >
                          {" "}
                          Login
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </AuthScreen>
    </>
  );
};

export default StudentRegister;
