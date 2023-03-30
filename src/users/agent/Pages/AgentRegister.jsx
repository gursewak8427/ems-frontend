import React from "react";
import { useState } from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import AgentAuthScreen from "../Screens/Authentication/AgentAuthScreen";
// import { Form, div, FormControl, FormLabel, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";


const AgentRegister = (props) => {

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        first_name: Yup.string()
            .required('First name is required'),
        last_name: Yup.string()
            .required('Last name is required'),
        street: Yup.string()
            .required('Street is required'),
        city: Yup.string()
            .required('City is required'),
        state: Yup.string()
            .required('State is required'),
        country: Yup.string()
            .required('Country is required'),
        postalcode: Yup.string()
            .required('Postal code is required'),
        phone: Yup.string()
            .required('Phone number is required')
    });

    const handleSubmit = (values) => {
        const config = { 'content-type': 'application/json' }
        axios.post(process.env.REACT_APP_NODE_URL + "/agent/register", values).then(res => {
            // redirect
            if(res.data.status == "0"){
                alert(res.data.message)
            }else{
                window.location.href = "/d/"
            }
        }).catch(err => {
            console.log(err.response.data)
            alert(err.response.data.message)
        })
    };



    return (
        <>
            <AgentAuthScreen>
                <>   <div className="row">
                    <div className="">
                        <div className="mt-5 md:col-start-2 md:mt-0 m-auto w-full lg:w-12/12">
                            <div className="">
                                <div className="space-y-6 bg-white px-4 pb-5 pt-[20px] sm:p-6 form-login">

                                    <div className="">

                                        <Formik
                                            initialValues={{
                                                email: '',
                                                first_name: '',
                                                last_name: '',
                                                street: '',
                                                city: '',
                                                state: '',
                                                country: '',
                                                postalcode: '',
                                                phone: ''
                                            }}
                                            validationSchema={validationSchema}
                                            onSubmit={handleSubmit}
                                        >
                                            {({ touched, errors, isSubmitting, values }) => (
                                                <Form>
                                                    <div className="row flex">
                                                        <div className="m-2 w-6/12">
                                                            <label for="email">Email</label>
                                                            <Field
                                                                type="email"
                                                                name="email"
                                                                id="email"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="email" component="div" className="text-sm text-danger" />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <label for="phone">Phone</label>
                                                            <Field
                                                                type="number"
                                                                name="phone"
                                                                id="phone"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="phone" component="div" className="text-sm text-danger" />
                                                        </div>

                                                    </div>
                                                    <div className="flex">
                                                        <div className="m-2 w-6/12">
                                                            <label for="first_name">First Name</label>
                                                            <Field
                                                                type="text"
                                                                name="first_name"
                                                                id="first_name"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="first_name" component="div" className="text-sm text-danger" />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <label for="last_name">Last Name</label>
                                                            <Field
                                                                type="text"
                                                                name="last_name"
                                                                id="last_name"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="last_name" component="div" className="text-sm text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="m-2 w-6/12">
                                                            <label for="street">Street</label>
                                                            <Field
                                                                type="text"
                                                                name="street"
                                                                id="street"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="street" component="div" className="text-sm text-danger" />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <label for="city">City</label>
                                                            <Field
                                                                type="text"
                                                                name="city"
                                                                id="city"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="city" component="div" className="text-sm text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="m-2 w-6/12">
                                                            <label for="state">State</label>
                                                            <Field
                                                                type="text"
                                                                name="state"
                                                                id="state"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="state" component="div" className="text-sm text-danger" />
                                                        </div>
                                                        <div className="m-2 w-6/12">
                                                            <label for="country">Country</label>
                                                            <Field
                                                                type="text"
                                                                name="country"
                                                                id="country"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="country" component="div" className="text-sm text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="m-2 w-6/12">
                                                            <label for="postalcode">Postalcode</label>
                                                            <Field
                                                                type="number"
                                                                name="postalcode"
                                                                id="postalcode"
                                                                className={`block w-full flex-1 border-gray-300 focus:border-black border-2 border-gray p-2 w-full focus:ring-indigo-500 sm:text-sm form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                                            />
                                                            <ErrorMessage name="postalcode" component="div" className="text-sm text-danger" />
                                                        </div>

                                                    </div>
                                                    <div className="text-center">
                                                        <button type="submit" className="bg-gradient-primary text-white px-4 py-1 mt-4 mb-0 text-white rounded-full">Register</button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="text-center pt-2 px-lg-2 px-1">
                                        <p className="mb-4 text-sm mx-auto">
                                            Already have an account?
                                            <span onClick={() => props.setPage(2)} className="text-info text-gradient cursor-pointer font-bold"> Login</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            </AgentAuthScreen>
        </>
    )
}

export default AgentRegister;