/* eslint-disable no-lone-blocks */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Logo from "../../website/images/logo.png";
import Gogl from "../../website/images/gogl.png";
import Fbk from "../../website/images/fbk.png";
import Mail from "../../website/images/mail.png";
import Key from "../../website/images/key.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { GrClose } from "react-icons/gr";
// Password Eye
import Eye from "../../website/images/eye.png";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import axios from "axios";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AgentAuthScreen from "../../agent/Screens/Authentication/AgentAuthScreen";
import AuthScreen from "../../student/Screens/Authentication/StudentAuthScreen";
import Dashboard from "../../student/Screens/Dashboard/StudentDashboard";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// firebase
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../../../firebase";
import ButtonPrimaryCopy from "../../../common/Buttons/ButtonPrimarycopy";
const provider = new GoogleAuthProvider();

const Login3 = (props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState({
    username: "",
    password: "",
    submitProcessing: false,
    data: "",

    redirect: searchParams.get("redirect"),
    type: searchParams.get("type"),
    school: searchParams.get("school"),
    program: searchParams.get("program"),

    email: "",
    confirmpassword: "",
    newpassword: "",
  });
  const handleInput = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  // // agent login api
  const LoginNow = async () => {
    setState({
      ...state,
      submitProcessing: true,
    });
    const { username, password } = state;

    if (username == "" || password == "")
      return toast("All fields are required");

    const data = { username, password };
    const config = { "content-type": "application/json" };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/agent/login", data)
      .then((res) => {
        console.log({ data: res });
        if (res.data.status == "0") {
          toast(res.data.message);
          return;
        }
        authenticate(res, "agent", () => {
          // toast(res.data.message)
          console.log("Token added as agent_token");
          window.location.href = "/d/agent/";
        });
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
        toast(err.response.data.message);
      });
  };
  // student login api
  const LoginStudent = async () => {
    setState({
      ...state,
      submitProcessing: true,
    });
    const { data, password } = state;
    const data2 = { data, password };
    const config = { "content-type": "application/json" };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/student/login", data2)
      .then((res) => {
        console.log(res);
        if (res.data.status == "0") {
          toast(res.data.message);
          setState({
            ...state,
            submitProcessing: false,
          });
          return;
        }
        authenticate(res, "student", () => {
          if (state.redirect == "true") {
            // enroll API
            let api_data = {
              student_id: "anything",
              school_id: state.school,
              program_id: state.program,
            };
            const config = {
              headers: { Authorization: `Bearer ${res.data.details.token}` },
            };

            axios
              .post(
                `${process.env.REACT_APP_NODE_URL}/student/enroll`,
                api_data,
                config
              )
              .then((response) => {
                console.log(response);
                toast(response.data.message);

                setState({
                  ...state,
                  submitProcessing: false,
                });

                window.location.href = "/d/student/";
              })
              .catch((err) => {
                setState({
                  ...state,
                  submitProcessing: false,
                });
              });
          } else {
            console.log("Token added as agent_token");
            window.location.href = "/d/student/";
          }
        });
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const signin = () => {
    setState({
      ...state,
      submitProcessing: true,
    });

    signInWithPopup(firebaseAuth, provider)
      .then((res) => {
        const userDtl = res.user.providerData[0];
        console.log(res);
        const data = {
          email: userDtl.email,
          firstName: userDtl.displayName.split(" ")[0],
          lastName: userDtl.displayName.split(" ")[1],
          phone: userDtl.phoneNumber,
          loginProvider: "google",
          uid: userDtl.uid,
          tokens: {
            idToken: res._tokenResponse.oauthIdToken,
          },
        };
        const config = { "content-type": "application/json" };

        axios
          .post(
            process.env.REACT_APP_NODE_URL + "/student/student_google_login",
            data
          )
          .then((res) => {
            console.log({ res11: res });
            if (res.data.status == "0") {
              toast(res.data.message);
              setState({
                ...state,
                submitProcessing: false,
              });
              return;
            }
            authenticate(res, "student", () => {
              // toast(res.data.message)
              if (state.redirect == "true") {
                // enroll API
                let api_data = {
                  student_id: "anything",
                  school_id: state.school,
                  program_id: state.program,
                };
                const config = {
                  headers: {
                    Authorization: `Bearer ${res.data.details.token}`,
                  },
                };
                axios
                  .post(
                    `${process.env.REACT_APP_NODE_URL}/student/enroll`,
                    api_data,
                    config
                  )
                  .then((response) => {
                    console.log(response);
                    toast(response.data.message);
                    window.location.href = "/d/student/";
                  });
              } else {
                setState({
                  ...state,
                  submitProcessing: false,
                });
                console.log("Token added as agent_token");
                window.location.href = "/d/student/";
              }
            });
            // window.location.href = "/student/login"
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
              toast(msg);
              setState({
                ...state,
                submitProcessing: false,
              });
              return;
            }
            setState({
              ...state,
              submitProcessing: false,
            });
            toast(err.response.data.message);
          });
      })
      .catch((err) => {
        toast(err.message);
        setState({
          ...state,
          submitProcessing: false,
        });
      });
  };
  // Agent Register
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    postalcode: Yup.string().required("Postal code is required"),
    phone: Yup.string().required("Phone number is required"),
  });
  const handleSubmit = (values) => {
    const config = { "content-type": "application/json" };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/agent/register", values)
      .then((res) => {
        // redirect
        if (res.data.status == "0") {
          toast(res.data.message);
        } else {
          window.location.href = "/login3";
          setagentRegisterSide(false);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast(err.response.data.message);
      });
  };
  // Student Register
  const RegisterNow = async (values) => {
    setState({
      ...state,
      submitProcessing: true,
    });
    const { email, password, confirmPassword, firstName, lastName, phone } =
      values;
    if (password !== confirmPassword)
      return toast("Both passwords should be same");
    const data = { email, password, firstName, lastName, phone };
    const config = { "content-type": "application/json" };

    axios
      .post(process.env.REACT_APP_NODE_URL + "/student/register", data)
      .then((res) => {
        console.log({ register: res });
        if (res.data.status === "0") {
          toast(res.data.message);
          setState({
            ...state,
            submitProcessing: false,
          });
          return;
        }
        if (state.redirect === "true") {
          window.location.href =
            "/d" + state.school + "&program=" + state.program;
        } else {
          window.location.href = "/d";
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.data.name === "ValidationError") {
          let errors = err.response.data.details.error;
          let msg = "";
          for (const key in errors) {
            msg += errors[key] += "\n";
            console.log([key, errors[key]]);
          }
          toast(msg);
          return;
        }
        toast(err.response.data.message);
      });
  };
  // student forgot password screen
  const { token } = useParams();
  const ForgotStudent = async () => {
    if (state.newpassword !== state.confirmpassword) {
      toast("Both passwords should be same");
      return;
    }
    if (state.newpassword === "" || state.confirmpassword === "") {
      toast("Both passwords are required");
      return;
    }
    setState({
      ...state,
      submitProcessing: true,
    });
    const { data, password } = state;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const data2 = { newPassword: state.confirmpassword };
    axios
      .post(
        process.env.REACT_APP_NODE_URL + "/student/setnewpassword",
        data2,
        config
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === "0") {
          toast(res.data.message);
          return;
        }
        toast(res.data.message);
        navigate("/d");
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
        toast(err.response.data.message);
      });
  };
  const SendEmail = async () => {
    if (state.email === "") {
      toast("Email is required");
      return;
    }
    setState({
      ...state,
      submitProcessing: true,
    });
    const data = { email: state.email };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/student/forgotpassword", data)
      .then((res) => {
        console.log(res);
        if (res.data.status === "0") {
          toast(res.data.message);
          return;
        }
        toast(res.data.message);
        setStudentForgotPassword(false);
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
        toast(err.response.data.message);
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
  // password eye Toggle for Both Student and Agent Screen
  const [typeConfirm, setTypeConfirm] = useState("password");
  const [iconConfirm, setIconConfirm] = useState(eye);
  const [typeConfirmNew, setTypeConfirmNew] = useState("password");
  const [iconConfirmNew, setIconConfirmNew] = useState(eye);
  const handleToggleConfirm = () => {
    if (typeConfirm === "password") {
      setIconConfirm(eyeOff);
      setTypeConfirm("text");
    } else {
      setIconConfirm(eye);
      setTypeConfirm("password");
    }
  };
  const handleToggleConfirmTwo = () => {
    if (typeConfirmNew === "password") {
      setIconConfirmNew(eyeOff);
      setTypeConfirmNew("text");
    } else {
      setIconConfirmNew(eye);
      setTypeConfirmNew("password");
    }
  };
  // Modal
  const [StudentForgotPassword, setStudentForgotPassword] = useState(false);
  // Login Method Tabs Active Button Methods
  const [agentLoginSide, setagentLoginSide] = useState(true);
  const [studentLoginSide, setstudentLoginSide] = useState(false);
  const [agentRegisterSide, setagentRegisterSide] = useState(false);
  const [studentRegisterSide, setstudentRegisterSide] = useState(false);
  const [click1, setclick1] = useState("click1");
  const [click2, setclick2] = useState();
  const handleAgentButton = () => {
    setagentLoginSide(true);
    setstudentLoginSide(false);
    setagentRegisterSide(false);
    setstudentRegisterSide(false);
    setclick1("click1");
    setclick2();
  };
  const handleStudentButton = () => {
    setstudentLoginSide(true);
    setagentLoginSide(false);
    setagentRegisterSide(false);
    setstudentRegisterSide(false);
    setclick1();
    setclick2("click1");
  };
  return (
    <>
      <ToastContainer />
      <div className="new-main">
        <div className="lg:flex items-center">
          <div className="lg:w-1/2 flex items-center justify-center new-left  py-10 lg:py-0 px-4 lg:px-0">
            <img className="w-40 lg:w-96" src={Logo} alt="" />
          </div>
          <div className="lg:w-1/2  new-right flex items-center">
            <div className="rt-inner w-full">
              <div className="inner-form-data rounded-lg border border-2 bg-white p-10">
                <h2 style={{ marginBottom: "30px" }}>
                  Welcome to
                  <br />
                  <b>Learn Global</b>
                </h2>
                <div className="login_method_btns">
                  <button onClick={handleAgentButton} className={click1}>
                    Agent
                  </button>
                  <button onClick={handleStudentButton} className={click2}>
                    Student
                  </button>
                </div>
                {agentLoginSide ? (
                  <AgentAuthScreen>
                    <div>
                      <div className="part-cont relative text-center my-3">
                        <p>
                          <span className="relative bg-white py-2 px-10">
                            Agent Login
                          </span>
                        </p>
                      </div>
                      <div className="input-content py-2 px-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <img src={Mail} alt="" />
                          </div>
                          <div className="w-full">
                            <label className="custom-field one w-full">
                              <input
                                name="username"
                                value={state.username}
                                onChange={handleInput}
                                className="w-full"
                                type="text"
                                placeholder=" "
                              />
                              <span className="placeholder">User Name</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="input-content py-2 px-4 mt-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <img src={Key} alt="" />
                          </div>
                          <div className="w-full">
                            <label className="custom-field one w-full">
                              <input
                                name="password"
                                type={typeConfirm}
                                value={state.password}
                                onChange={handleInput}
                                className="w-full"
                                placeholder=" "
                              />
                              <span className="placeholder">Password</span>
                            </label>
                            <div className="field_eye_view">
                              <div
                                className="icon icon-eye"
                                onClick={handleToggleConfirm}
                              >
                                <Icon icon={iconConfirm} size={20} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2  mt-4 rounded-lg">
                        <div className="flex  gap-2">
                          <div className="ml-auto">
                            <Link to="#" className="text-primary forgot-link">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={LoginNow}
                        className="log-btn w-full py-4 text-white mt-4 rounded-lg"
                      >
                        Login
                      </button>
                      {/* <button id="google_login_a" className="shadow w-full justify-center p-2 rounded flex items-center gap-2 mt-5">
                        <img src={Gogl} alt="" />
                        Login with Google
                      </button> */}
                      <p className="mt-5 text-center">
                        Don’t have an account ?{" "}
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setagentRegisterSide(!agentRegisterSide)(
                              setagentLoginSide(false)
                            )
                          }
                          className="forgot-link"
                        >
                          Register
                        </p>
                      </p>
                    </div>
                  </AgentAuthScreen>
                ) : (
                  ""
                )}
                {agentRegisterSide ? (
                  <AgentAuthScreen>
                    <>
                      <div className="part-cont relative text-center my-3">
                        <p>
                          <span className="relative bg-white py-2 px-10">
                            Agent Register
                          </span>
                        </p>
                      </div>
                      <div className="row">
                        <div className="">
                          <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-12/12">
                            <div className="">
                              <div className="bg-white form-login">
                                <div className="">
                                  <Formik
                                    initialValues={{
                                      email: "",
                                      first_name: "",
                                      last_name: "",
                                      street: "",
                                      city: "",
                                      state: "",
                                      country: "",
                                      postalcode: "",
                                      phone: "",
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                  >
                                    {({
                                      touched,
                                      errors,
                                      isSubmitting,
                                      values,
                                    }) => (
                                      <Form>
                                        <div className="row flex">
                                          <div className="m-2 w-6/12">
                                            <label for="email">Email</label>
                                            <Field
                                              type="email"
                                              name="email"
                                              id="email"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="email"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                          <div className="m-2 w-6/12">
                                            <label for="phone">Phone</label>
                                            <Field
                                              type="number"
                                              name="phone"
                                              id="phone"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="phone"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex">
                                          <div className="m-2 w-6/12">
                                            <label for="first_name">
                                              First Name
                                            </label>
                                            <Field
                                              type="text"
                                              name="first_name"
                                              id="first_name"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="first_name"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                          <div className="m-2 w-6/12">
                                            <label for="last_name">
                                              Last Name
                                            </label>
                                            <Field
                                              type="text"
                                              name="last_name"
                                              id="last_name"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="last_name"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex">
                                          <div className="m-2 w-6/12">
                                            <label for="street">Street</label>
                                            <Field
                                              type="text"
                                              name="street"
                                              id="street"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="street"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                          <div className="m-2 w-6/12">
                                            <label for="city">City</label>
                                            <Field
                                              type="text"
                                              name="city"
                                              id="city"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="city"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex">
                                          <div className="m-2 w-6/12">
                                            <label for="state">State</label>
                                            <Field
                                              type="text"
                                              name="state"
                                              id="state"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="state"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                          <div className="m-2 w-6/12">
                                            <label for="country">Country</label>
                                            <Field
                                              type="text"
                                              name="country"
                                              id="country"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="country"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="m-2 w-6/12">
                                            <label for="postalcode">
                                              Postalcode
                                            </label>
                                            <Field
                                              type="number"
                                              name="postalcode"
                                              id="postalcode"
                                              className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${
                                                touched.email && errors.email
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                            <ErrorMessage
                                              name="postalcode"
                                              component="div"
                                              className="text-sm text-danger"
                                            />
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <button
                                            type="submit"
                                            className="log-btn w-full py-4 text-white mt-4 rounded-lg"
                                          >
                                            Register
                                          </button>
                                        </div>
                                      </Form>
                                    )}
                                  </Formik>
                                </div>
                                <div className="text-center pt-2 px-lg-2 px-1">
                                  <p className="mb-4 text-sm mx-auto">
                                    Already have an account?
                                    <span
                                      onClick={() =>
                                        setagentRegisterSide(false)(
                                          setagentLoginSide(!agentLoginSide)
                                        )
                                      }
                                      className="cursor-pointer font-bold"
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
                  </AgentAuthScreen>
                ) : (
                  ""
                )}
                {studentLoginSide ? (
                  <AuthScreen>
                    <div>
                      <div className="part-cont relative text-center my-3">
                        <p>
                          <span className="relative bg-white py-2 px-10">
                            Student Login
                          </span>
                        </p>
                      </div>
                      <div className="input-content py-2 px-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <img src={Mail} alt="" />
                          </div>
                          <div className="w-full">
                            <label className="custom-field one w-full">
                              <input
                                type="text"
                                name="data"
                                value={state.data}
                                onChange={handleInput}
                                className="w-full"
                                placeholder=" "
                              />
                              <span className="placeholder">
                                Enter Email Or Phone
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="input-content py-2 px-4 mt-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <img src={Key} alt="" />
                          </div>
                          <div className="w-full">
                            <label className="custom-field one w-full">
                              <input
                                type={typeConfirmNew}
                                name="password"
                                value={state.password}
                                onChange={handleInput}
                                className="w-full"
                                placeholder=" "
                              />
                              <span className="placeholder">Password</span>
                            </label>
                            <div className="field_eye_view">
                              <div
                                className="icon icon-eye"
                                onClick={handleToggleConfirmTwo}
                              >
                                <Icon icon={iconConfirmNew} size={20} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2  mt-4 rounded-lg">
                        <div className="flex  gap-2">
                          <div className="ml-auto">
                            <Link
                              to=""
                              onClick={() =>
                                setStudentForgotPassword(!StudentForgotPassword)
                              }
                              className="text-primary forgot-link"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <ButtonPrimaryCopy
                        id="bt"
                        title={"Login"}
                        onclick={LoginStudent}
                        // loading={state.submitProcessing}
                      />
                      <button
                        onClick={signin}
                        id="google_login_a"
                        className="shadow w-full justify-center p-2 rounded flex items-center gap-2 mt-5"
                      >
                        <img src={Gogl} alt="" />
                        Login with Google
                      </button>
                      <p className="mt-5 text-center">
                        Don’t have an account ?{" "}
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setstudentRegisterSide(!studentRegisterSide)(
                              setstudentLoginSide(false)
                            )
                          }
                          className="forgot-link"
                        >
                          Register
                        </p>
                      </p>
                    </div>
                  </AuthScreen>
                ) : (
                  ""
                )}
                {/* Forgot Password Popup */}
                {StudentForgotPassword && (
                  <div className="modal_cover">
                    <div className="modal_inner">
                      <div className="header_modal login-part-modal">
                        <GrClose
                          onClick={() => setStudentForgotPassword(false)}
                        />
                        <h4 className="my-2 text-center font-bold text-xl mb-10">
                          Forgot Your Password
                        </h4>
                      </div>
                      <AuthScreen>
                        {!token ? (
                          <div className="flex flex-col justify-center">
                            <div className="">
                              <div className="">
                                <div className="shadow sm:overflow-hidden sm:rounded-md">
                                  <div className="space-y-6 bg-white px-4 py-2 sm:p-2">
                                    <div className="">
                                      <div className="col-span-3 sm:col-span-2">
                                        <label
                                          htmlFor="company-website"
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          Email
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                          <input
                                            type="email"
                                            name="email"
                                            value={state.email}
                                            onChange={handleInput}
                                            id="company-website"
                                            className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter your Email"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                      type="button"
                                      onClick={SendEmail}
                                      className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center pt-2 px-lg-2 px-1">
                              <p className="mb-4 text-sm mx-auto">
                                Want to login?
                                <span
                                  onClick={() =>
                                    setStudentForgotPassword(false)
                                  }
                                  className="pl-2 text-gradient font-bold cursor-pointer"
                                >
                                  Login
                                </span>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                              <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-9/12">
                                <h1 className="text-xl mb-2 font-black">
                                  Set New Password
                                </h1>
                                <div className="shadow sm:overflow-hidden sm:rounded-md">
                                  <div className="space-y-6 bg-white px-4 py-2 sm:p-2">
                                    <div className="">
                                      <div className="col-span-3 sm:col-span-2">
                                        <label
                                          htmlFor="company-website"
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          New Password
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                          <input
                                            type="password"
                                            name="newpassword"
                                            value={state.newpassword}
                                            onChange={handleInput}
                                            id="company-website"
                                            className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter your email or phone"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="about"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Confirm Password
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="password"
                                          name="confirmpassword"
                                          value={state.confirmpassword}
                                          onChange={handleInput}
                                          className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                                          placeholder="Enter your confirm password"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                      type="button"
                                      onClick={ForgotStudent}
                                      className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center pt-2 px-lg-2 px-1">
                              <p className="mb-4 text-sm mx-auto">
                                Want to login?
                                <span
                                  onClick={() =>
                                    setStudentForgotPassword(false)
                                  }
                                  className="pl-2 text-info text-gradient font-bold cursor-pointer"
                                >
                                  Login
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      </AuthScreen>
                    </div>
                  </div>
                )}
                {/* End - Forgot Password Popup */}
                {studentRegisterSide ? (
                  <AuthScreen>
                    <>
                      <div className="part-cont relative text-center my-3">
                        <p>
                          <span className="relative bg-white py-2 px-10">
                            Student Register
                          </span>
                        </p>
                      </div>
                      <div className="row">
                        <div className="">
                          <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-12/12">
                            <div className="">
                              <div className="bg-white form-login">
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
                                      // toast("Form is validated and in this block api call should be made...");
                                    }}
                                  >
                                    {({
                                      touched,
                                      errors,
                                      isSubmitting,
                                      values,
                                    }) => {
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
                                                  touched.firstName &&
                                                  errors.firstName
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
                                                  touched.lastName &&
                                                  errors.lastName
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
                                                touched.password &&
                                                errors.password
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
                                            <button
                                              title={"Register"}
                                              loading={state.submitProcessing}
                                              type="submit"
                                              className="log-btn w-full py-4 text-white mt-4 rounded-lg"
                                            >
                                              Register
                                            </button>
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
                                      onClick={() =>
                                        setstudentRegisterSide(false)(
                                          setstudentLoginSide(!studentLoginSide)
                                        )
                                      }
                                      className="cursor-pointer font-bold"
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
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login3;
