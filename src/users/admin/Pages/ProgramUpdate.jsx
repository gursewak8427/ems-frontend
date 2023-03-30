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

const ProgramUpdate = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    acceptable_band: 6,
    acceptance_letter: 35,
    application_fee: 95,
    cost_of_living: 0,
    credentials: "PG",
    currency: "CAD",
    description: "",
    duration: 2,
    duration_sem_per_year: null,
    english_language: 0,
    foundation_fee: 0,
    grade_score: 60,
    ielts_listening: 0,
    ielts_reading: 0,
    ielts_speaking: 0,
    ielts_writting: 0,
    max_tution_fee: 18000,
    min_tution_fee_per_semester: 15000,
    module: 4,
    new_stream: ["Business"],
    other_comment: "Overall 6.5 No Less Than 6.0",
    other_fees: 0,
    overall_band: 6.5,
    process_days: 2,
    program_id: "7bc9c36b-8b93-414e-a540-e4e294fd9610",
    program_level: ["Graduate"],
    program_name: "Global Business Management - GBC2 - (Barrydowne)",
    program_sort_order: 0,
    pte_score: 61,
    stream_id: 7,
    tofel_point: 84,
    visa_processing_days: 2,
    few_seats_status: false,
    top_status: false,

    programDetails: null,
  });

  const [countries, setCountries] = useState([]);

  const { schoolId, programId } = useParams();

  useEffect(() => {
    // get Single Schools
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getSingleProgram", {
        schoolId,
        programId,
      })
      .then((res) => {
        console.log({ programDtl: res });
        setState({
          ...state,
          programDetails: res.data.details.programDetail,
          acceptable_band: res.data.details.programDetail.acceptable_band,
          acceptance_letter: res.data.details.programDetail.acceptance_letter,
          application_fee: res.data.details.programDetail.application_fee,
          cost_of_living: res.data.details.programDetail.cost_of_living,
          credentials: res.data.details.programDetail.credentials,
          currency: res.data.details.programDetail.currency,
          description: res.data.details.programDetail.description,
          duration: res.data.details.programDetail.duration,
          duration_sem_per_year:
            res?.data?.details?.programDetail?.duration_sem_per_year || 0,
          english_language: res.data.details.programDetail.english_language,
          foundation_fee: res.data.details.programDetail.foundation_fee,
          grade_score: res.data.details.programDetail.grade_score,
          ielts_listening: res.data.details.programDetail.ielts_listening,
          ielts_reading: res.data.details.programDetail.ielts_reading,
          ielts_speaking: res.data.details.programDetail.ielts_speaking,
          ielts_writting: res.data.details.programDetail.ielts_writting,
          max_tution_fee: res.data.details.programDetail.max_tution_fee,
          min_tution_fee_per_semester:
            res.data.details.programDetail.min_tution_fee_per_semester,
          module: res.data.details.programDetail.module,
          new_stream: res.data.details.programDetail.new_stream,
          other_comment: res.data.details.programDetail.other_comment,
          other_fees: res.data.details.programDetail.other_fees,
          overall_band: res.data.details.programDetail.overall_band,
          process_days: res.data.details.programDetail.process_days,
          program_id: res.data.details.programDetail.program_id,
          program_level: res.data.details.programDetail.program_level,
          program_name: res.data.details.programDetail.program_name,
          program_sort_order: res.data.details.programDetail.program_sort_order,
          pte_score: res.data.details.programDetail.pte_score,
          stream_id: res.data.details.programDetail.stream_id,
          tofel_point: res.data.details.programDetail.tofel_point,
          visa_processing_days:
            res.data.details.programDetail.visa_processing_days,
          few_seats_status: res.data.details.programDetail.few_seats_status,
          top_status: res.data.details.programDetail.top_status,
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

  if (!state.programDetails) {
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
                    <label className="font-black">Program Name</label>
                    <input
                      placeholder="Program Name"
                      type="text"
                      class="capitalize block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="school_name"
                      value={state.program_name}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black">Description</label>
                    <input
                      placeholder="Description"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="description"
                      value={state.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex">
                <div class="m-3 w-3/12">
                    <label className="font-black">Duration Year</label>
                    <input
                      placeholder="Duration"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="duration"
                      value={state.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-3/12">
                    <label className="font-black">Duration Sem Per Year</label>
                    <input
                      placeholder="Duration Semester Per Year"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="duration_sem_per_year"
                      value={state.duration_sem_per_year}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">Visa Processing Days</label>

                    <input
                      placeholder="Duration"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="visa_processing_days"
                      value={state.visa_processing_days}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div class="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Acceptance Letter</label>
                    <input
                      placeholder="Acceptance Letter"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="acceptance_letter"
                      value={state.acceptance_letter}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black">Acceptable Band</label>
                    <input
                      placeholder="Acceptable Band"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="acceptable_band"
                      value={state.acceptable_band}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Modules</label>
                    <input
                      placeholder="Modules"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="module"
                      value={state.module}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="m-3 w-6/12">
                    <label className="font-black">Application Fee</label>
                    <input
                      placeholder="Application Fee"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="application_fee"
                      value={state.application_fee}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Credentials</label>
                    <input
                      placeholder="Credentials"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="credentials"
                      value={state.credentials}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">Streams</label>
                    <select
                      type="select"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="new_stream"
                      value={state.new_stream}
                      multiple
                      onChange={handleChange}
                    >
                      <option value="Business">Business</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Level</label>
                    <select
                      type="select"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="program_level"
                      value={state.program_level}
                      onChange={handleChange}
                    >
                      <option value="Graduate">Graduate</option>
                      <option value="Undergraduate">Undergraduate</option>
                    </select>
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">Cost Of Living</label>
                    <input
                      placeholder="Cost Of Living"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="cost_of_living"
                      value={state.cost_of_living}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Currency</label>
                    <input
                      placeholder="Currency"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="currency"
                      value={state.currency}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">Grade Score</label>
                    <input
                      placeholder="Grade Score"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="grade_score"
                      value={state.founded}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Overall Band</label>
                    <input
                      placeholder="Overall Band"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="overall_band"
                      value={state.overall_band}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">Pte Score</label>
                    <input
                      placeholder="Pte Score"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="pte_score"
                      value={state.pte_score}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Tofel Points</label>
                    <input
                      placeholder="Tofel Points"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="tofel_point"
                      value={state.tofel_point}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">English Language</label>
                    <input
                      placeholder="English Language"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="english_language"
                      value={state.english_language}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Foundation Fee</label>
                    <input
                      placeholder="Foundation Fee"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="foundation_fee"
                      value={state.foundation_fee}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-3/12">
                    <label className="font-black">Max Tuition Fees</label>
                    <input
                      placeholder="Max Tuition Fees"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="max_tution_fee"
                      value={state.max_tution_fee}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-3/12">
                    <label className="font-black">Min Tuition Fees</label>
                    <input
                      placeholder="Min Tuition Fees"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="min_tution_fee_per_semester"
                      value={state.min_tution_fee_per_semester}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12">
                    <label className="font-black">Other Fees</label>
                    <input
                      placeholder="Other Fees"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="other_fees"
                      value={state.other_fees}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="m-3 w-6/12">
                    <label className="font-black">Other Comment</label>
                    <input
                      placeholder="Other Comment"
                      type="text"
                      class="block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm"
                      name="other_comment"
                      value={state.other_comment}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="few_seats_status"
                      defaultChecked={state.few_seats_status}
                      onChange={handleChange}
                    />
                    <label className="font-black">Few Seats</label>
                  </div>
                  <div class="m-3 w-6/12 flex items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      name="top_status"
                      defaultChecked={state.top_status}
                      onChange={handleChange}
                    />
                    <label className="font-black">Top Status</label>
                  </div>
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

export default ProgramUpdate;
