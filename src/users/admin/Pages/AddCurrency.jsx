import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect } from "react-router-dom";
import { getCookie, getToken, setCookie } from "../../../helper/auth";
import Papa from "papaparse";
import Dashboard from "../Screens/Dashboard/Dashboard";
// import "./Addschoolname.css";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
const countryToCurrency = require('country-to-currency');

// web-socket
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3006";
// console.log("COnnecting")
// var socket = socketIOClient(ENDPOINT);

const AddCurrency = () => {
  const [state, setState] = useState({
    countryList: [],

    countryId: "",
    countryCode: "",
    countryPrice: "",
    plusPrice: "",
    isWait: true,
    list: [],

    showPopup: false,
  });

  useEffect(() => {
    // get country list
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/country")
      .then((countryResponse) => {
        console.log({ countryResponse });
        if (countryResponse.data.status == "1") {
          axios
            .get(process.env.REACT_APP_NODE_URL + "/admin/getcurrency")
            .then((response) => {
              console.log(response);
              if (response.data.status == "1") {
                setState({
                  ...state,
                  list: response.data.details.list,
                  countryList: countryResponse.data.details.countries,
                  isWait: false,
                });
              } else {
                setState({
                  ...state,
                  isWait: false,
                });
              }
            });
        }
      });
  }, []);

  const handleChange = async (e) => {
    if (e.target.name == "countryId") {
      setState({
        ...state,
        countryId: e.target.value,
      })
      console.log({ val: e.target.value, code: countryToCurrency[e.target.value] })
      // Here countryId is the country Code US, CA etc.
      // hit API
      let response = await axios.get(`https://api.exchangerate.host/latest?base=${countryToCurrency[e.target.value]}&symbols=INR`)
      let rates = response.data.rates["INR"]
      console.log({
        ...state,
        countryCode: countryToCurrency[e.target.value],
        countryPrice: rates,
      })
      setState({
        ...state,
        countryId: e.target.value,
        countryCode: countryToCurrency[e.target.value],
        countryPrice: rates,
      })
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }

  }

  const uploadData = async () => {
    try {
      const fd = new FormData();

      let requiredError = [];
      if (state.countryId == "") {
        requiredError.push("Country");
      }
      if (requiredError.length > 0) {
        toast.error(requiredError.join(", ") + " is required");
        return;
      }

      setState({
        ...state,
        submitProcessing: true,
      });

      const config = { headers: { "Authorization": `Bearer ${getToken("admin")}` } }
      let response = await axios.post(
        process.env.REACT_APP_NODE_URL + "/admin/addcurrency",
        {
          countryId: state.countryId,
          countryCode: state.countryCode,
          plusPrice: state.plusPrice,
        },
        config,
      );

      if (response.data.status == "1") {
        setState({
          ...state,
          countryId: "",
          countryCode: "",
          countryPrice: "",
          plusPrice: "",
          list: [...state.list, response.data.details.newCurrency],
          submitProcessing: false,
          showPopup: false,
        });
      } else {
        setState({
          ...state,
          submitProcessing: false,
        });
      }
      if (response.data.status == "1") {
        toast(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setState({
        ...state,
        submitProcessing: false,
      });
    }
  };

  const updateData = async () => {
    try {
      let index = state.updatedId;
      const fd = new FormData();
      fd.append("schoolLogo", state.schoolLogo);
      fd.append("countryLogo", state.countryLogo);
      fd.append("id", state.list[index]._id);

      setState({
        ...state,
        submitProcessing: true,
      });
      let response = await axios.post(
        process.env.REACT_APP_NODE_URL + "/admin/updateschoolname",
        fd
      );

      console.log("im here");
      console.log(document.getElementById("countryLogoInput"));
      document.getElementById("countryLogoInput").value = "";
      document.getElementById("schoolLogoInput").value = "";
      if (response.data.status == "1") {
        toast(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      if (response.data.status == "1") {
        let oldData = state.list;
        oldData[index] = response.data.details.updatedSchoolName;
        oldData = oldData.map((data) => {
          if (data.country == response.data.details.updatedSchoolName.country) {
            data.countryLogo =
              response.data.details.updatedSchoolName.countryLogo;
          }
          return data;
        });

        setState({
          ...state,
          list: oldData,
          countryId: "",
          countryFlag: "",
          schoolName: "",
          schoolFlag: "",
          stateId: "",
          cityId: "",
          updatedId: null,
          submitProcessing: false,
          showPopup: false,
        });
      } else {
        setState({
          ...state,
          submitProcessing: false,
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setState({
        ...state,
        submitProcessing: false,
      });
    }
  };

  const setUpdate = (index) => {
    setState({
      ...state,
      schoolName: state.list[index].schoolName,
      schoolLogo: state.list[index].schoolLogo,
      countryId: state.list[index].country,
      countryLogo: state.list[index].countryLogo,
      stateId: state.list[index].state,
      cityId: state.list[index].city,
      updatedId: index,
      showPopup: true,
    });
  };

  const removeUpdate = (_) => {
    setState({
      ...state,
      schoolName: "",
      schoolLogo: "",
      countryLogo: "",
      countryId: "",
      stateId: "",
      cityId: "",
      updatedId: null,
      showPopup: false,
    });
  };

  const getStates = (countryId) => {
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/state/" + countryId)
      .then((stateResponse) => {
        console.log({ stateResponse });
        if (stateResponse.data.status == "1") {
          setState({
            ...state,
            countryId,
            stateList: stateResponse.data.details.state,
          });
        }
      });
  };

  const getCities = (stateId) => {
    axios
      .get(process.env.REACT_APP_NODE_URL + "/address/city/" + stateId)
      .then((cityResponse) => {
        console.log({ cityResponse });
        if (cityResponse.data.status == "1") {
          setState({
            ...state,
            stateId,
            cityList: cityResponse.data.details.city,
          });
        }
      });
  };

  const deleteNow = async (school, index) => {
    if (window.confirm(`Are you confirm to delete ${school.countryName} ?`)) {
      // deleteSchoolName api
      const config = { headers: { "Authorization": `Bearer ${getToken("admin")}` } }
      axios
        .delete(
          process.env.REACT_APP_NODE_URL +
          "/admin/deletecurrency/" +
          school._id,
          config
        )
        .then((res) => {
          if (res.data.status == "1") {
            let oldData = state.list;
            oldData.splice(index, 1);
            setState({
              ...state,
              list: oldData,
            });
          }
        });
    }
  };

  return (
    <>
      <div heading_title={"Add School Detail"}>
        <>
          <div className="row addCountryPage flex flex-row">
            <div
              className={`w-5/12 mx-auto my-4 createSchoolNamePopup ${state.showPopup && "active"
                }`}
            >
              <label htmlFor="">
                <div className="flex justify-between align-center">
                  <div className="span">Add Currency Details</div>
                  <button
                    className="bg-[red] w-[30px] h-[30px] text-[white] rounded-full pt-[2px]"
                    onClick={() => {
                      setState({
                        ...state,
                        showPopup: false,
                        countryId: "",
                        countryCode: "",
                        countryPrice: "",
                        updatedId: null,
                      });
                    }}
                  >
                    <span>X</span>
                  </button>
                </div>
              </label>
              <div className="shadow-lg card-body p-2">
                {state.updatedId == null && (
                  <>
                    <label>Country Name</label>
                    <div className="mb-3">
                      {/* <input
                                        placeholder="Enter School Name"
                                        type="text" className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm   " name="countryId" value={state.countryId} onChange={handleChange} /> */}

                      <select
                        className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                        name="countryId"
                        value={state.countryId}
                        onChange={handleChange}
                      >
                        <option value="">Choose</option>
                        {state.countryList.map((country) => {
                          return (
                            <option value={country.countrySortName}>
                              {country.countryName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </>
                )}

                <label>Currency Code </label>
                <div className="mb-3">
                  <input
                    placeholder="Enter Country Code"
                    type="text"
                    className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm   "
                    name="countryCode"
                    value={state.countryCode}
                    onChange={handleChange}
                  />
                </div>

                <label>Price </label>
                <div className="mb-3">
                  <input
                    disabled
                    type="text"
                    className="bg-[lightgrey] block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm   "
                    value={state.countryPrice}
                  /></div>

                <label>Plus Price </label>
                <div className="mb-3">
                  <input
                    type="text"
                    className="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm   "
                    value={state.plusPrice}
                    name="plusPrice"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex mt-3">
                  {state.updatedId != null ? (
                    <ButtonPrimary
                      title={"Update"}
                      onclick={updateData}
                      loading={state.submitProcessing}
                    />
                  ) : (
                    <ButtonPrimary
                      title={"Save"}
                      onclick={uploadData}
                      loading={state.submitProcessing}
                    />
                  )}

                  {/* <button
                  type="button"
                  class="btn bg-gradient-primary w-100 ml-0 mt-4 text-white px-2 py-1 rounded mb-0 text-lg"
                  onClick={() =>
                    state.submitProcessing
                      ? null
                      : state.updatedId != null
                        ? updateData()
                        : uploadData()
                  }

                >
                  {state.submitProcessing ? (
                    <div aria-label="Loading..." role="status">
                      <svg class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
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
                  ) : state.updatedId != null ? (
                    <>Update</>
                  ) : (
                    <>Save</>
                  )}
                </button> */}

                  {state.updatedId != null && (
                    <div className="ml-1">
                      <ButtonPrimary
                        title={"Cancel"}
                        onclick={removeUpdate}
                        theme="danger"
                      />
                    </div>
                    // <button
                    //   type="button"
                    //   className="btn bg-[red] w-100 ml-2 mt-4 text-white px-2 py-1 rounded mb-0 text-lg"
                    //   onClick={removeUpdate}
                    // >
                    //   Cancel
                    // </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mx-auto w-full my-4 p-45">
              <div className="flex justify-end">
                <button
                  className="addNewBtn"
                  onClick={() => {
                    setState({
                      ...state,
                      showPopup: true,
                    });
                  }}
                >
                  Add New
                </button>
              </div>
              <div class="flex flex-col">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden shadow-lg border">
                      <table class="min-w-full agent-table">
                        <thead class="">
                          <tr>
                            <th class="text-sm font-medium text-gray-900 px-2 py-4 text-left font-bold">
                              Sr.
                            </th>
                            <th class="capitalize text-sm font-medium text-gray-900 px-2 py-4 text-left font-bold">
                              country name
                            </th>
                            <th class="capitalize text-sm font-medium text-gray-900 px-2 py-4 text-left font-bold">
                              country code
                            </th>
                            <th class="capitalize text-sm font-medium text-gray-900 px-2 py-4 text-left font-bold">
                              Add Amount
                            </th>
                            <th class="capitalize text-sm font-medium text-gray-900 px-6 py-4 text-center font-bold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.list.map((school, index) => {
                            return (
                              <tr class="bg-gray-100 border-b">
                                <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="text-sm text-gray-900 font-light p-2 whitespace-nowrap capitalize">
                                  {school?.countryName || "--"}
                                </td>
                                <td className="text-sm text-gray-900 font-light p-2 whitespace-nowrap capitalize">
                                  {school?.countryCode ||
                                    "--"}
                                </td>
                                <td className="text-sm text-gray-900 font-light p-2 whitespace-nowrap capitalize">
                                  {school?.plusPrice || "--"}
                                </td>
                                <td className="text-sm text-gray-900 font-light p-2 whitespace-nowrap">
                                  <div className="action-icons-list">
                                    {/* <i
                                      className="action-icon fa-solid fa-pen-to-square cursor-pointer"
                                      onClick={() => setUpdate(index)}
                                    ></i> */}
                                    <i
                                      className="action-icon fa-solid fa-trash cursor-pointer text-[red]"
                                      onClick={() => deleteNow(school, index)}
                                    ></i>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {state.isWait ? (
                        <div>
                          <center className="w-full my-10">
                            <img
                              width={100}
                              src="https://i.gifer.com/ZZ5H.gif"
                              alt=""
                            />
                          </center>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default AddCurrency;
