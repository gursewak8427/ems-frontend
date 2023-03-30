/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Logo from "../../website/images/logo.png";
import Gogl from "../../website/images/gogl.png";
import Fbk from "../../website/images/fbk.png";
import Mail from "../../website/images/mail.png";
import Key from "../../website/images/key.png";
import Eye from "../../website/images/eye.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import axios from "axios";
import { authenticate } from "../../../helper/auth";
import AuthScreen from "../Screens/Authentication/AuthScreen";
import Dashboard from "../Screens/Dashboard/Dashboard";
import { setCookie, getCookie } from "../../../helper/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrClose } from "react-icons/gr";
import { useEffect } from "react";
export default function Login2(props) {
  const [ModalCode, setModalCode] = useState(false);
  const [ForgotPassword, setForgotPassword] = useState(false);
  const { token } = useParams();
  const [state, setState] = useState({
    email: "",
    password: "",
    submitProcessing: false,
    isShowPassword: false,
    isCodeSend: false,
    code: "",
    tokenPreserve: "",
    isSave: false,

    confirmpassword: "",
    newpassword: "",
  });
  const navigate = useNavigate();


  const ForgotNow = async () => {
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
      .patch(
        process.env.REACT_APP_NODE_URL + "/admin/setNewPassword",
        data2,
        config
      )
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          submitProcessing: false,
        });
        if (res.data.status === "0") {
          toast(res.data.message);
          return;
        }
        toast(res.data.message);
        navigate("/d/adminlogin123");
        // redirect
      })
      .catch((err) => {
        setState({
          ...state,
          submitProcessing: false,
        });

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
      .post(process.env.REACT_APP_NODE_URL + "/admin/forgotPassword", data)
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

  const LoginNow = async (e) => {
    e.preventDefault();

    const { email, password } = state;
    const data = { email, password };
    const config = { "content-type": "application/json" };

    setState({
      ...state,
      submitProcessing: true,
    });

    axios
      .post(process.env.REACT_APP_NODE_URL + "/users/login", data)
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

        authenticate(res, "admin", () => {
          console.log("Login Successfully");
          window.location.href = "/d/admin/";
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        toast(err.response.data.message);
        setState({
          ...state,
          submitProcessing: false,
        });
      });
  };
  const VerifyCode = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const { email } = state;
    const code = parseInt(otp.join(""));
    const data = { email, code };
    if (code === "") {
      toast("Verification code is required");
      return;
    }
    const config = { "content-type": "application/json" };
    setState({
      ...state,
      submitProcessing: true,
    });
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/verifycode", data)
      .then((res) => {
        console.log(res.data);

        // Show code input at frontend

        if (res.data.status == "0") {
          toast(res.data.message);
          setState({
            ...state,
            submitProcessing: false,
          });
          return;
        }

        authenticate(res, "admin", () => {
          // toast(res.data.message)
          console.log({ state });
          if (state.isSave) {
            setCookie("admin-2fa", state.tokenPreserve);
          }

          console.log("Token added as admin_token");
          window.location.href =
            props.role == "ADMIN" ? "/d/admin/" : "/d/admin/";
        });
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
        setState({
          ...state,
          submitProcessing: false,
        });
        toast(err.response.data.message);
      });
  };
  const handleInput = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // password eye
  const [typeConfirm, setTypeConfirm] = useState("password");
  const [iconConfirm, setIconConfirm] = useState(eye);
  const handleToggleConfirm = () => {
    if (typeConfirm === "password") {
      setIconConfirm(eyeOff);
      setTypeConfirm("text");
    } else {
      setIconConfirm(eye);
      setTypeConfirm("password");
    }
  };
  const [otp, setOtp] = useState(new Array(5).fill(""));

  const handleChange = (e, index) => {
    if (isNaN(e.value)) return false;

    let oldotp = otp;
    oldotp[index] = e.value;
    console.log({ val: e.value, index });
    setOtp(oldotp);

    //Focus next input
    if (e.nextSibling && e.value != "") {
      e.nextSibling.focus();
    }
    if (e.value === "") {
      e.previousSibling.focus();
    }

    if (index + 1 == otp.length && e.value != "") {
      VerifyCode();
    }
  };
  return (
    <>
      <AuthScreen>
        <>
          <div className="new-main">
            <div className="lg:flex items-center">
              <div className="lg:w-1/2 flex items-center justify-center new-left  py-10 lg:py-0 px-4 lg:px-0">
                <img className="w-40 lg:w-96" src={"https://logodownload.org/wp-content/uploads/2018/09/ems-logo-2.png"} alt="" />
              </div>
              {!token ? (
                <>
                  <div className="lg:w-1/2  new-right flex items-center">
                    <div className="rt-inner w-full">
                      <div className="inner-form-data rounded-lg border border-2 bg-white p-10">
                        <form key={"1234"} onSubmit={LoginNow}>
                          <h2>
                            Welcome to
                            <br />
                            <b>EMS</b>
                          </h2>
                          <div className="part-cont relative uppercase text-center my-6">
                            <p>
                              <span className="relative bg-white py-2 px-10">
                                Login
                              </span>
                            </p>
                          </div>
                          <div className="input-content py-2 px-4 rounded-lg">
                            <div className="flex items-center gap-4 w-full">
                              <div>
                                <img src={Mail} alt="" />
                              </div>
                              <div className="w-full">
                                <label className="custom-field one w-full">
                                  <input
                                    className="w-full"
                                    type="text"
                                    name="email"
                                    value={state.email}
                                    onChange={handleInput}
                                    placeholder=" "
                                  />
                                  <span className="placeholder">Email</span>
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
                                    value={state.password}
                                    onChange={handleInput}
                                    className="w-full"
                                    type={typeConfirm}
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
                          <div className="py-0 mb-6 rounded-lg mx-6">
                            <div className="flex  gap-2">
                              {/* <div>
                            <input type="checkbox" />
                          </div> */}
                              {/* <div className="">
                            <label>Remember me</label>
                          </div> */}
                              <div className="ml-auto">
                                <div
                                  className="text-primary forgot-link cursor-pointer"
                                  onClick={() =>
                                    setForgotPassword(!ForgotPassword)
                                  }
                                >
                                  Forgot Password?
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* <div className="bg-gray-50 mx-6 p-2 px-6">
                            <input
                              type="checkbox"
                              name="isSave"
                              onChange={() => {
                                setState({
                                  ...state,
                                  isSave: !state.isSave,
                                });
                              }}
                              id="isSave"
                            />
                            <label htmlFor="isSave" className="p-2">
                              Save for this device
                            </label>
                          </div> */}

                          <div className="px-4 py-3 text-right sm:px-6">
                            <button
                              type="submit"
                              // onClick={state.submitProcessing ? null : LoginNow}
                              className="log-btn w-full py-4 text-white mt-4 rounded-lg"
                            >
                              {state.submitProcessing ? (
                                <center>
                                  <div aria-label="Loading..." role="status">
                                    <svg
                                      class="h-5 w-5 animate-spin"
                                      viewBox="3 3 18 18"
                                    >
                                      <path
                                        class="fill-gray-200"
                                        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                                      ></path>
                                      <path
                                        class="fill-gray-800"
                                        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                                      ></path>
                                    </svg>
                                  </div>
                                </center>
                              ) : (
                                "Login"
                              )}
                            </button>
                          </div>
                          {ModalCode ? (
                            <div className="modal_cover">
                              <div className="modal_inner">
                                <div className="header_modal login-part-modal">
                                  {/* <GrClose onClick={() => setModalCode(false)} /> */}
                                  <h4 className="my-2 text-center font-bold text-xl mb-10">
                                    Please enter the One Time Password
                                    <br /> for verify your account
                                  </h4>
                                  <div className="form-login">
                                    <form key={"123"} onSubmit={VerifyCode}>
                                      <div className="flex items-center justify-center gap-2 my-2">
                                        {otp.map((_, index) => {
                                          return (
                                            <input
                                              className="p-2 border"
                                              type="text"
                                              name="code"
                                              maxLength="1"
                                              key={index}
                                              onChange={(e) =>
                                                handleChange(e.target, index)
                                              }
                                              onFocus={(e) => e.target.select()}
                                            />
                                          );
                                        })}
                                      </div>
                                      {/* <div className="flex items-center justify-center">
                                    <span
                                      className="text-[#475569] hover:text-black hover:underline cursor-pointer"
                                      onClick={LoginNow}
                                    >
                                      Resend
                                    </span>
                                  </div> */}
                                      {/* <div className="bg-gray-50 px-4 py-3 sm:px-6">
                                    <input
                                      type="checkbox"
                                      name="isSave"
                                      onChange={() => {
                                        setState({
                                          ...state,
                                          isSave: !state.isSave,
                                        });
                                      }}
                                      id="isSave"
                                    />
                                    <label htmlFor="isSave" className="p-2">
                                      Save for this device
                                    </label>
                                  </div> */}
                                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                        <button
                                          type="submit"
                                          onClick={
                                            state.submitProcessing
                                              ? null
                                              : VerifyCode
                                          }
                                        >
                                          {state.submitProcessing
                                            ? "Verifing..."
                                            : "Verify"}
                                        </button>
                                      </div>
                                      <div className="flex items-end justify-end">
                                        <span
                                          className="text-[#475569] hover:text-black hover:underline cursor-pointer"
                                          onClick={LoginNow}
                                        >
                                          Resend
                                        </span>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {/* <p className="mt-10 text-center">
                        Don’t have an account ?{" "}
                        <Link to="#" className="forgot-link">
                          Register
                        </Link>
                      </p> */}
                        </form>
                      </div>
                    </div>
                  </div>
                  {
                    /* Forgot Password Popup */
                    ForgotPassword && (
                      <div className="modal_cover">
                        <div className="modal_inner">
                          <div className="header_modal login-part-modal">
                            <GrClose onClick={() => setForgotPassword(false)} />
                            <h4 className="my-2 text-center font-bold text-xl mb-10">
                              Forgot Your Password
                            </h4>
                          </div>
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
                            {/* <div className="text-center pt-2 px-lg-2 px-1">
                          <p className="mb-4 text-sm mx-auto">
                            Want to login?
                            <span
                              onClick={() => setForgotPassword(false)}
                              className="pl-2 text-gradient font-bold cursor-pointer"
                            >
                              Login
                            </span>
                          </p>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    )
                  }
                </>
              ) : (
                <div className="lg:w-1/2  new-right flex items-center">
                  <div className="rt-inner w-full">
                    <div className="inner-form-data rounded-lg border border-2 bg-white p-10">
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
                            onClick={ForgotNow}
                            className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      <div className="text-center pt-2 px-lg-2 px-1">
                        <p className="mb-4 text-sm mx-auto">
                          Want to login?
                          <span
                            onClick={() => setForgotPassword(false)}
                            className="pl-2 text-info text-gradient font-bold cursor-pointer"
                          >
                            Login
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                /* End - Forgot Password Popup */
              )}
            </div>
          </div>
        </>
      </AuthScreen>
    </>
  );
}
