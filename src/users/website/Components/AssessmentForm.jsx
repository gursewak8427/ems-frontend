import React, { Component, useEffect, useState } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AssessmentForm.css";
import { setLocalStorage } from "../../../helper/auth";

const AssessmentForm = ({ popup, closeForm }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    activeIndex: 0,
  });

  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    destination_country: "",
    aggree_to_privacy_policy: false,
    btnLoading: true,
  });

  const handleFormData = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return {
        status: true,
      };
    }
    return {
      status: false,
      message: "You have entered an invalid email address!",
    };
  }

  function phoneNumberValidation(inputtxt) {
    var phoneno = /^\d{10}$/;
    if (phoneno.test(inputtxt)) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
        message: "Please enter a valid phone number!",
      };
    }
  }

  const getErrors = () => {
    var isError = false;
    document.getElementById("firstName").style.borderColor = "grey";
    document.getElementById("lastName").style.borderColor = "grey";
    document.getElementById("email").style.borderColor = "grey";
    document.getElementById("phone").style.borderColor = "grey";
    document.getElementById("destination_country").style.borderColor = "grey";
    document.getElementById("aggree_to_privacy_policy").innerText = "";

    if (formdata.firstName == "") {
      isError = true;
      document.getElementById("firstName").style.borderWidth = "2px";
      document.getElementById("firstName").style.borderColor = "red";
    }
    if (formdata.lastName == "") {
      isError = true;
      document.getElementById("lastName").style.borderWidth = "2px";
      document.getElementById("lastName").style.borderColor = "red";
    }
    if (formdata.email == "") {
      isError = true;
      document.getElementById("email").style.borderWidth = "2px";
      document.getElementById("email").style.borderColor = "red";
    } else {
      const result = ValidateEmail(formdata.email);
      if (!result.status) {
        isError = true;
        document.getElementById("email_error").innerText = result.message;
        document.getElementById("email_error").style.color = "red";
        document.getElementById("email").style.borderWidth = "2px";
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("email").style.marginBottom = "0px";
      } else {
        document.getElementById("email_error").innerText = "";
        document.getElementById("email_error").style.color = "red";
        document.getElementById("email").style.borderWidth = "2px";
        document.getElementById("email").style.borderColor = "black";
        document.getElementById("email").style.marginBottom = "15px";
      }
    }
    if (formdata.phone == "") {
      isError = true;
      document.getElementById("phone").style.borderWidth = "2px";
      document.getElementById("phone").style.borderColor = "red";
    } else {
      const result = phoneNumberValidation(parseInt(formdata.phone));
      console.log({result})
      if (!result.status) {
        isError = true;
        document.getElementById("phone_error").innerText = result.message;
        document.getElementById("phone_error").style.color = "red";
        document.getElementById("phone").style.borderWidth = "2px";
        document.getElementById("phone").style.borderColor = "red";
        document.getElementById("phone").style.marginBottom = "0px";
      } else {
        document.getElementById("phone_error").innerText = "";
        document.getElementById("phone_error").style.color = "red";
        document.getElementById("phone").style.borderWidth = "2px";
        document.getElementById("phone").style.borderColor = "black";
        document.getElementById("phone").style.marginBottom = "15px";
      }
    }
    if (formdata.destination_country == "") {
      isError = true;
      document.getElementById("destination_country").style.borderWidth = "2px";
      document.getElementById("destination_country").style.borderColor = "red";
    }
    if (formdata.aggree_to_privacy_policy == false) {
      isError = true;
      document.getElementById("aggree_to_privacy_policy").innerText =
        "*Please aggree to the Privacy Policy";
      document.getElementById("aggree_to_privacy_policy").style.color = "red";
    }
    return isError;
  };

  const submitForm = () => {
    if (getErrors()) return;

    setState({
      ...state,
      btnLoading: true,
    });

    axios
      .post(
        `${process.env.REACT_APP_NODE_URL}/student/fillassessmentform`,
        formdata
      )
      .then((response) => {
        alert(response.data.message);
        setState({
          ...state,
          btnLoading: false,
        });
        closeForm();
        // setLocalStorage("assessmentform", { visited: true })
      });
  };

  return (
    <>
      <div className={`${popup ? "active" : ""} overlay`}></div>
      <div className={`${popup ? "popup" : ""} pop-form`}>
        <h4 className="flex items-center justify-between p-[10px]">
          <span>
            <small>Visa Assessment Form</small>
          </span>
          <span onClick={closeForm} className="cursor-pointer">
            X
          </span>
        </h4>
        <p className="mb-0 mx-[10px]">
          Learn Global, Please fill the below visa enquiry form to help us
          assist you better.
        </p>
        <div className="flex">
          <input
            type="text"
            placeholder="First Name*"
            onChange={handleFormData}
            value={formdata.firstName}
            id="firstName"
            name="firstName"
            className="w-6/12"
          />
          <input
            type="text"
            placeholder="Last Name*"
            onChange={handleFormData}
            value={formdata.lastName}
            id="lastName"
            name="lastName"
            className="w-6/12"
          />
        </div>
        <input
          type="email"
          placeholder="Email*"
          onChange={handleFormData}
          value={formdata.email}
          id="email"
          name="email"
        />
        <p className="mx-[10px]" id="email_error"></p>
        <input
          type="text"
          placeholder="Phone*"
          onChange={handleFormData}
          value={formdata.phone}
          id="phone"
          name="phone"
        />
        <p className="mx-[10px]" id="phone_error"></p>
        <p className="mb-0 mx-[10px]">Your preferred study destination</p>
        <select
          onChange={handleFormData}
          value={formdata.destination_country}
          id="destination_country"
          name="destination_country"
        >
          <option value="">--Select--</option>
          <option value="Australia">Australia</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Canada">Canada</option>
          <option value="Usa">Usa</option>
        </select>
        <p className="mb-0 mx-[10px]">
          Learn Global is that institution that remove rough edges from the way
          of your success.
        </p>
        <p className="global-text p-0 normal">
          <input
            type="checkbox"
            onChange={() =>
              setFormData({
                ...formdata,
                aggree_to_privacy_policy: !formdata.aggree_to_privacy_policy,
              })
            }
          />{" "}
          I agree to Learn Global&nbsp;
          <a href="#">Terms</a>&nbsp;and<a href="#">&nbsp;Privacy Policy </a>
        </p>
        <p className="mx-[10px]" id="aggree_to_privacy_policy"></p>
        <button type="button" onClick={state.btnLoading ? null : submitForm}>
          {state.btnLoading ? (
            <center>
              <div aria-label="Loading..." role="status">
                <svg class="h-4 w-4 animate-spin" viewBox="3 3 18 18">
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
            <>Register Now</>
          )}
        </button>
      </div>
    </>
  );
};

export default AssessmentForm;
