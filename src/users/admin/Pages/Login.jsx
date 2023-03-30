import axios from "axios";
import { useState } from "react";
import { Navigate, redirect } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AuthScreen from "../Screens/Authentication/AuthScreen";
import Dashboard from "../Screens/Dashboard/Dashboard";
import { setCookie, getCookie } from "../../../helper/auth";

const Login = (props) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    submitProcessing: false,
    isShowPassword: false,
    isCodeSend: false,
    code: "",
    tokenPreserve: "",
    isSave: false,
  });

  const LoginNow = async (e) => {
    e.preventDefault();

    const { email, password } = state;
    const data = { email, password, tokenPreserve: getCookie("admin-2fa") };
    const config = { "content-type": "application/json" };
    console.log({
      method: "POST",
      headers: config,
      data: data,
      url: process.env.REACT_APP_NODE_URL + "/admin/login",
    });

    setState({
      ...state,
      submitProcessing: true,
    });

    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/login", data)
      .then((res) => {
        console.log(res);

        if (res.data.status == "0") {
          alert(res.data.message);
          setState({
            ...state,
            submitProcessing: false,
          });
          return;
        }

        let mode = res.data.details.mode;
        if (mode == "LOGIN") {
          authenticate(res, "admin", () => {
            console.log("Login Successfully without 2FA");
            window.location.href =
              props.role == "ADMIN" ? "/d/admin/" : "/d/subadmin/";
          });
        } else if (mode == "2FA") {
          // code send to email
          // Show code input at frontend
          alert("Verification Code Send Successfully");
          setState({
            ...state,
            isCodeSend: true,
            submitProcessing: false,
            tokenPreserve: res.data.details.token,
          });
        } else {
          console.log("Login mode not received from server");
        }

        // authenticate(res, "admin", () => {
        //     // alert(res.data.message)
        //     console.log("Token added as admin_token")
        //     window.location.href = "/d/admin/"
        // })
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data.message);
        setState({
          ...state,
          submitProcessing: false,
        });
      });
  };
  const VerifyCode = async (e) => {
    e.preventDefault();

    const { email, code } = state;
    const data = { email, code };
    if (code == "") {
      alert("Verification code is required");
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
          alert(res.data.message);
          setState({
            ...state,
            submitProcessing: false,
          });
          return;
        }

        authenticate(res, "admin", () => {
          // alert(res.data.message)
          console.log({ state });
          if (state.isSave) {
            setCookie("admin-2fa", state.tokenPreserve);
          }

          console.log("Token added as admin_token");
          window.location.href =
            props.role == "ADMIN" ? "/d/admin/" : "/d/subadmin/";
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
        alert(err.response.data.message);
      });
  };
  const handleInput = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <AuthScreen>
        <>
          <div>
            {state.isCodeSend ? (
              <div className="">
                <div className="form-login">
                  <form key={"123"} onSubmit={VerifyCode}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md border-2 border-[gray] py-5 bg-white">
                      <div className="space-y-6 bg-white px-4 pb-2 pt-[20px]">
                        <p className="text-center text-gray my-2">
                          An email with a verification code was just send to
                          test****r@gmail.com
                        </p>
                        <div className="col-span-3 sm:col-span-2">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Code
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              name="code"
                              value={state.code}
                              onChange={handleInput}
                              id="company-website"
                              className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                              placeholder="Enter Code"
                            />
                          </div>
                          <div className="flex items-end justify-end">
                            <span
                              className="text-[#475569] hover:text-black hover:underline cursor-pointer"
                              onClick={LoginNow}
                            >
                              Resend
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6">
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
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                          type="submit"
                          // onClick={state.submitProcessing ? null : VerifyCode}
                          className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {state.submitProcessing ? (
                            <div aria-label="Loading..." role="status">
                              <svg
                                class="h-6 w-6 animate-spin"
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
                          ) : (
                            <>Login</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-9/12">
                  <form key={"1234"} onSubmit={LoginNow}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md border-2 border-[gray] py-5 bg-white form-login">
                      <div className="space-y-6 px-4 py-5 sm:p-6">
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
                                placeholder="Enter Your Email"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <div className="mt-1">
                            <input
                              type="password"
                              name="password"
                              value={state.password}
                              onChange={handleInput}
                              className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                              placeholder="Enter your password"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 text-right sm:px-6">
                        <button
                          type="submit"
                          // onClick={state.submitProcessing ? null : LoginNow}
                          className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {state.submitProcessing ? (
                            <div aria-label="Loading..." role="status">
                              <svg
                                class="h-6 w-6 animate-spin"
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
                          ) : (
                            <>Login</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      </AuthScreen>
    </>
  );
};

export default Login;
