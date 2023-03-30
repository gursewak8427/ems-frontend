import { Switch } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getCookie, setCookie } from "../../../helper/auth";
import Papa from "papaparse";
import Dashboard from "../Screens/Dashboard/Dashboard";
// import "./Addschoolname.css";
import { useDropzone } from "react-dropzone";

const SchoolUpdate = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    school_name: "", // disabled
    school_about: "",
    school_location: "",
    country: "", // disabled
    type: "",
    school_order: "",
    total_student: "",
    international_student: "",
    accomodation_feature: "",
    work_permit_feature: "",
    program_cooporation: "",
    work_while_study: "",
    condition_offer_letter: "",
    library: "",
    founded: "",

    schoolDetails: null,
  });

  const [countries, setCountries] = useState([]);

  const { schoolId } = useParams();

  useEffect(() => {
    // get Single Schools
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getSingleSchool", {
        schoolId,
      })
      .then((res) => {
        console.log({ schoolDtl: res });
        setState({
          ...state,
          schoolDetails: res.data.details.schoolDetails,
          school_name: res.data.details.schoolDetails.school_name || "",
          school_about: res.data.details.schoolDetails.school_about || "",
          school_location: res.data.details.schoolDetails.school_location || "",
          country: res.data.details.schoolDetails.country || "",
          type: res.data.details.schoolDetails.type || "",
          school_order: res.data.details.schoolDetails.school_order,
          total_student: res.data.details.schoolDetails.total_student || "",
          international_student:
            res.data.details.schoolDetails.international_student || "",
          accomodation_feature:
            res.data.details.schoolDetails.accomodation_feature || "",
          work_permit_feature:
            res.data.details.schoolDetails.work_permit_feature || "",
          program_cooporation:
            res.data.details.schoolDetails.program_cooporation || "",
          work_while_study:
            res.data.details.schoolDetails.work_while_study || "",
          condition_offer_letter:
            res.data.details.schoolDetails.condition_offer_letter || "",
          library: res.data.details.schoolDetails.library || "",
          founded: res.data.details.schoolDetails.founded || "",
        });
        setCountries(res.data.details.countries);
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  }, []);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const Update = () => {
    console.log(state);
    return;
    var data = {
      first_name: state.fname,
      last_name: state.lname,
      password: state.password,
      email: state.email,
      role: state.role,
    };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/registeremployee", data)
      .then((res) => {
        // authenticate with token
        // redirect
        if (res.data.status == "0") {
          alert(res.data.message);
          return;
        }
        alert(res.data.message);
        navigate("/d/admin/listemployee");
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };

  if (!state.schoolDetails) {
    return (
      <div>
        <center className="w-full my-10">
          <img width={100} src="https://i.gifer.com/ZZ5H.gif" alt="" />
        </center>
      </div>
    );
  }

  return (
    <>
      <div heading_title={"Update School"}>
        <>
          <div className="row addCountryPage flex flex-row justify-start">
            <div class="w-9/12 my-4 p-4">
              <div class="card-body">
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">School Name</label>
                    <input
                      placeholder="School Name"
                      type="text"
                      class="capitalize block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="school_name"
                      value={state.school_name}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">School About</label>
                    <input
                      placeholder="School About"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="school_about"
                      value={state.school_about}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">School Location</label>
                    <input
                      placeholder="School Location"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="school_location"
                      value={state.school_location}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">Country</label>
                    <select
                      disabled
                      type="select"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="country"
                      value={state.country}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      {countries.map((country) => {
                        return (
                          <option value={country.countryName}>
                            {country.countryName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div class="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">School Type</label>
                    <select
                      type="select"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="type"
                      value={state.type}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="Private College" selected>
                        Private College
                      </option>
                      <option value="Public College" selected>
                        Public College
                      </option>
                      <option value="Private University">
                        Private University
                      </option>
                      <option value="Public University">
                        Public University
                      </option>
                    </select>
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">School Order</label>
                    <input
                      placeholder="School Order"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="school_order"
                      value={state.school_order}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">Total Students</label>
                    <input
                      placeholder="Total Students"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="total_student"
                      value={state.total_student}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">Total International Students</label>
                    <input
                      placeholder="Total International Students"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="international_student"
                      value={state.international_student}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black text-md">Founded</label>
                    <input
                      placeholder="Total Founded"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="founded"
                      value={state.founded}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="work_permit_feature"
                      defaultChecked={state.work_permit_feature}
                      onChange={handleChange}
                    />
                    <label className="font-black text-md">Work Permit Feature</label>
                  </div>
                </div>

                <div className="flex">
                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="program_cooporation"
                      defaultChecked={state.program_cooporation}
                      onChange={handleChange}
                    />
                    <label className="font-black text-md">Program Cooporation</label>
                  </div>

                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="work_while_study"
                      defaultChecked={state.work_while_study}
                      onChange={handleChange}
                    />
                    <label className="font-black text-md">Work While Study</label>
                  </div>
                </div>

                <div className="flex">
                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="condition_offer_letter"
                      defaultChecked={state.condition_offer_letter}
                      onChange={handleChange}
                    />
                    <label className="font-black text-md">Condition Offer Letter</label>
                  </div>

                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      placeholder="Total Accomodation Feature"
                      type="checkbox"
                      class="mr-2"
                      name="accomodation_feature"
                      defaultChecked={state.accomodation_feature}
                      onChange={handleChange}
                    />
                    <label className="font-black text-md">Accomodation Feature</label>
                  </div>
                </div>

                <div className="flex">
                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="library"
                      defaultChecked={state.library}
                      onChange={handleChange}
                    />
                    <label className="font-black text-md">Library</label>
                  </div>
                  <div class="m-3 w-6/12"></div>
                </div>

                <button
                  type="button"
                  class="btn bg-gradient-primary w-100 mt-4 text-white px-2 py-1 rounded m-3"
                  onClick={() => alert("Pending...")}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default SchoolUpdate;
