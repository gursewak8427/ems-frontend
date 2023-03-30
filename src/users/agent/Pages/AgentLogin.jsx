import axios from "axios";
import { useState } from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AgentAuthScreen from "../Screens/Authentication/AgentAuthScreen";

const AgentLogin = (props) => {
  const [state, setState] = useState({
    username: "",
    password: "",
    submitProcessing: false,
  });

  const LoginNow = async () => {
    setState({
      ...state,
      submitProcessing: true,
    });
    const { username, password } = state;

    if (username == "" || password == "")
      return alert("All fields are required");

    const data = { username, password };
    const config = { "content-type": "application/json" };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/agent/login", data)
      .then((res) => {
        console.log({ data: res });
        if (res.data.status == "0") {
          alert(res.data.message);
          return;
        }
        authenticate(res, "agent", () => {
          // alert(res.data.message)
          console.log("Token added as agent_token");
          window.location.href = "/d/agent/";
        });
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
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
      <AgentAuthScreen>
        <>
          <div className="">
            <div className="">
              <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-9/12">
                <div className="">
                  <div className="space-y-6 bg-white px-4 pb-5 pt-[20px] sm:p-6 form-login">
                    <div className="">
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="username"
                            value={state.username}
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

                    <div className="px-4 py-3 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={LoginNow}
                        className="bg-gradient-primary inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center pt-2 px-lg-2 px-1">
              <p className="mb-4 text-sm mx-auto">
                Don't have an account?
                <span
                  onClick={() => props.setPage(4)}
                  className="pl-2 text-info text-gradient font-bold cursor-pointer"
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </>
      </AgentAuthScreen>
    </>
  );
};

export default AgentLogin;
