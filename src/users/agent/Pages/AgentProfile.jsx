import React from 'react'
import { useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { authenticate, getToken, logoutHelper } from "../../../helper/auth";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AgentAuthScreen from "../Screens/Authentication/AgentAuthScreen";
// import { Form, div, FormControl, FormLabel, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import "./AgentProfile.css"
import { useEffect } from 'react';
import AgentDashboard from '../Screens/Dashboard/AgentDashboard';

const AgentProfile = () => {
    const navigate = useNavigate()
    const [state, setState] = useState({
        student_to_abroad: ["1-5", "6-20", "21-50", "51-150", "151-250", "210+"],
        marketing_methods: ["Online Advertising", "Education Fairs", "Workshops", "Sub-Agent Network", "Newspaper and Magazine Advertising", "Other"],
        average_fee: ["$0 - $200", "$200 - $500", "$500 - $1000", "$1000 - $2500", "$2500+"],
        students_refer_to_learn_global: ["1-5", "6-20", "21-50", "51-150", "151-250", "250+"],
        agentToken: getToken("agent"),
        initialValues: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            street: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
            principal_country_of_business: '',
            phone: '',
            company_name: '',
            facebook_page_name: '',
            cellphone: '',
            skype_ID: '',
            whatsapp_ID: '',
            instagram_handle: '',
            twitter_handle: '',
            linkedin_URL: '',
            // recruitement details are below
            begin_recruiting_students: '',
            services: '',
            canadaian_schools_represented: '',
            american_schools_represented: '',
            represents_other_countries: '',
            institutions_representing: '',
            belongs_to: '',
            recruit_from: '',
            student_to_abroad: "",
            marketing_methods: [],
            average_fee: "",
            students_refer_to_learn_global: "",
            reference_phone: '',
            reference_website: '',
        },
        business_certificate: "",
        company_logo: "",
        base_url: "",
        status: "",
        isWait: true,
    })

    const countryList = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas (the)",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands (the)",
        "Central African Republic (the)",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands (the)",
        "Colombia",
        "Comoros (the)",
        "Congo (the Democratic Republic of the)",
        "Congo (the)",
        "Cook Islands (the)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic (the)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands (the) [Malvinas]",
        "Faroe Islands (the)",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories (the)",
        "Gabon",
        "Gambia (the)",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (the)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic (the)",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands (the)",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands (the)",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger (the)",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands (the)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines (the)",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation (the)",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan (the)",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands (the)",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates (the)",
        "United Kingdom of Great Britain and Northern Ireland (the)",
        "United States Minor Outlying Islands (the)",
        "United States of America (the)",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands"
    ];

    const [files, setFiles] = useState({
        business_certificate: '',
        company_logo: '',
    })

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        first_name: Yup.string()
            .required('First name is required'),
        last_name: Yup.string()
            .required('Last name is required'),
        city: Yup.string()
            .required('City is required'),
        state: Yup.string()
            .required('State is required'),
        country: Yup.string()
            .required('Country is required'),
        postal_code: Yup.string()
            .required('Postal code is required'),
        phone: Yup.string()
            .required('Phone number is required'),

    });

    const handleSubmit = (values) => {
        let formData = new FormData();    //formdata object

        const keys = Object.keys(values);
        keys.forEach((key, index) => {
            formData.append(key, values[key]);
        });

        if (files.business_certificate != "") {
            formData.append("business_certificate_file", files.business_certificate)
        }

        if (files.company_logo != "") {
            formData.append("company_logo_file", files.company_logo)
        }

        const config = { headers: { "Authorization": `Bearer ${state.agentToken}` }, 'content-type': 'multipart/form-data' }
        axios.post(process.env.REACT_APP_NODE_URL + "/agent/update", formData, config).then(res => {
            console.log(res)
            alert(res.data.message)
        }).catch(err => {
            console.log(err.response.data)
            alert(err.response.data.message)
        })
    };

    const handleFiles = (e) => {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0]
        })
    };

    useEffect(() => {
        // get profile details
        const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }
        axios.get(process.env.REACT_APP_NODE_URL + "/agent/getprofile", config).then(res => {
            console.log(res.data.details)
            setState({
                ...state,
                initialValues: {
                    username: res.data.details.agent.username || "",
                    email: res.data.details.agent.email || "",
                    first_name: res.data.details.agent.first_name || "",
                    last_name: res.data.details.agent.last_name || "",
                    street: res.data.details.agent.street || "",
                    city: res.data.details.agent.city || "",
                    state: res.data.details.agent.state || "",
                    country: res.data.details.agent.country || "",
                    postal_code: res.data.details.agent.postal_code || "",
                    principal_country_of_business: res.data.details.agent.principal_country_of_business || "",
                    phone: res.data.details.agent.phone || "",
                    company_name: res.data.details.agent.company_name || "",
                    facebook_page_name: res.data.details.agent.facebook_page_name || "",
                    cellphone: res.data.details.agent.cellphone || "",
                    skype_ID: res.data.details.agent.skype_ID || "",
                    whatsapp_ID: res.data.details.agent.whatsapp_ID || "",
                    instagram_handle: res.data.details.agent.instagram_handle || "",
                    twitter_handle: res.data.details.agent.twitter_handle || "",
                    linkedin_URL: res.data.details.agent.linkedin_URL || "",
                    // recruitement details are below
                    begin_recruiting_students: res.data.details.agent.begin_recruiting_students || "",
                    services: res.data.details.agent.services || "",
                    canadaian_schools_represented: res.data.details.agent.canadaian_schools_represented || "",
                    american_schools_represented: res.data.details.agent.american_schools_represented || "",
                    represents_other_countries: res.data.details.agent.represents_other_countries || "",
                    institutions_representing: res.data.details.agent.institutions_representing || "",
                    belongs_to: res.data.details.agent.belongs_to || "",
                    recruit_from: res.data.details.agent.recruit_from || "",
                    student_to_abroad: res.data.details.agent.student_to_abroad || "",
                    marketing_methods: res.data.details.agent.marketing_methods || "",
                    average_fee: res.data.details.agent.average_fee || "",
                    students_refer_to_learn_global: res.data.details.agent.students_refer_to_learn_global || "",
                    reference_phone: res.data.details.agent.reference_phone || "",
                    reference_website: res.data.details.agent.reference_website || "",
                },
                isWait: false,
                status: res.data.details.agent.status || "",
                business_certificate: res.data.details.agent.business_certificate || "",
                company_logo: res.data.details.agent.company_logo || "",
                base_url: res.data.details.baseUrl || "",
            })
        }).catch(err => {
            console.log(err.response.data)
        })

    }, [])

    if (state.isWait) {
        return "Fetching profile details.."
    }


    const refreshToken = () => {
        const config = { headers: { "Authorization": `Bearer ${state.agentToken}` } }
        axios.get(process.env.REACT_APP_NODE_URL + "/agent/verifyToken", config).then(res => {
            alert(res.data.message)
            // verified
            window.location.href = "/agent/"
        }).catch(err => {
            alert(err.response.data.message)
            // console.log(err.response.data)
        })
    }
    return (
        <>
            <div>
                <>
                    <Formik
                        initialValues={state.initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ touched, errors, isSubmitting, values }) => (
                            <>
                                <div className="flex p-2 items-start justify-center">
                                    <Form className='flex-column w-9/12'>

                                        {/* heading 1 */}
                                        <div className='border-2 border-black border-bottom m-3'>
                                            <h4 className='text-xl font-black uppercase m-2'>Company Information</h4>
                                        </div>

                                        <div className='w-full flex'>
                                            <div className='flex m-2 flex-col w-6/12'>
                                                <label htmlFor="email">Username <span className="required">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    disabled readOnly
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex m-2 flex-col w-6/12'>
                                                <label htmlFor="email">Email <span className="required">*</span></label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    disabled readOnly
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='w-full flex'>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="first_name">Legal First Name <span className="required">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="first_name"
                                                    id="first_name"
                                                    className="border p-2 border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="first_name" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="last_name">Legal Last Name <span className="required">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="last_name"
                                                    id="last_name"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="last_name" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="phone">Phone <span className="required">*</span></label>
                                                <Field
                                                    type="number"
                                                    name="phone"
                                                    id="phone"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="phone" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='w-full flex'>

                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="street">Street</label>
                                                <Field
                                                    type="text"
                                                    name="street"
                                                    id="street"
                                                    className="border p-2 border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="street" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="city">City <span className="required">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="city" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="state">State <span className="required">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="state"
                                                    id="state"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="state" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="country">Country <span className="required">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="country"
                                                    id="country"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="country" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="postal_code">Postal Code <span className="required">*</span></label>
                                                <Field
                                                    type="number"
                                                    name="postal_code"
                                                    id="postal_code"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="postal_code" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="principal_country_of_business">Principal Country of Business</label>
                                                <Field
                                                    type="text"
                                                    name="principal_country_of_business"
                                                    id="principal_country_of_business"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    component="select"
                                                >
                                                    <option value="">--Select--</option>
                                                    {
                                                        countryList.map(item => <option value={item}>{item}</option>)
                                                    }
                                                </Field>
                                                <ErrorMessage name="principal_country_of_business" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="company_name">Company Name</label>
                                                <Field
                                                    type="text"
                                                    name="company_name"
                                                    id="company_name"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="company_name" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="facebook_page_name">Facebook Page Name</label>
                                                <Field
                                                    type="text"
                                                    name="facebook_page_name"
                                                    id="facebook_page_name"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="facebook_page_name" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="cellphone">Cellphone</label>
                                                <Field
                                                    type="number"
                                                    name="cellphone"
                                                    id="cellphone"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="cellphone" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="skype_ID">Skype ID</label>
                                                <Field
                                                    type="text"
                                                    name="skype_ID"
                                                    id="skype_ID"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="skype_ID" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="whatsapp_ID">WhatsApp ID</label>
                                                <Field
                                                    type="text"
                                                    name="whatsapp_ID"
                                                    id="whatsapp_ID"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="whatsapp_ID" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-4/12'>
                                                <label htmlFor="instagram_handle">Instagram Handle</label>
                                                <Field
                                                    type="text"
                                                    name="instagram_handle"
                                                    id="instagram_handle"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="instagram_handle" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="twitter_handle">Twitter Handle</label>
                                                <Field
                                                    type="text"
                                                    name="twitter_handle"
                                                    id="twitter_handle"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="twitter_handle" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2 w-4/12'>
                                                <label htmlFor="linkedin_URL">Linkedin URL</label>
                                                <Field
                                                    type="text"
                                                    name="linkedin_URL"
                                                    id="linkedin_URL"
                                                    className="border p-2 border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="linkedin_URL" component="div" className="text-danger" />
                                            </div>

                                        </div>


                                        {/* heading 2 */}
                                        <div className='border-2 border-black border-bottom m-3'>
                                            <h4 className='text-xl font-black uppercase m-2'>Recruitment Details</h4>
                                        </div>

                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2 w-full'>
                                                <label htmlFor="begin_recruiting_students">When did you begin recruiting students?</label>
                                                <Field
                                                    type="text"
                                                    name="begin_recruiting_students"
                                                    id="begin_recruiting_students"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="begin_recruiting_students" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2 w-full'>
                                                <label htmlFor="services">What services do you provide to your clients?</label>
                                                <Field
                                                    type="text"
                                                    name="services"
                                                    id="services"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    component="textarea"
                                                    rows="4"
                                                />
                                                <ErrorMessage name="services" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className="w-4/12">
                                                <div className='flex  items-center m-2'>
                                                    <Field
                                                        type="checkbox"
                                                        name="canadaian_schools_represented"
                                                        id="canadaian_schools_represented"
                                                        className="m-2"
                                                    />
                                                    <label htmlFor="canadaian_schools_represented">Canadian Schools Represented</label>
                                                </div>
                                            </div>
                                            <div className="w-4/12">
                                                <div className='flex  items-center m-2'>
                                                    <Field
                                                        type="checkbox"
                                                        name="american_schools_represented"
                                                        id="american_schools_represented"
                                                        className="m-2"
                                                    />
                                                    <label htmlFor="american_schools_represented">American Schools Represented</label>
                                                </div>
                                            </div>
                                            <div className="w-4/12">
                                                <div className='flex  items-center m-2'>
                                                    <Field
                                                        type="checkbox"
                                                        name="represents_other_countries"
                                                        id="represents_other_countries"
                                                        className="m-2"
                                                    />
                                                    <label htmlFor="represents_other_countries">Represents Other Countries</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2  w-6/12'>
                                                <label htmlFor="institutions_representing">What institutions are you representing?</label>
                                                <Field
                                                    type="text"
                                                    name="institutions_representing"
                                                    id="institutions_representing"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    component="textarea"
                                                    rows="4"
                                                />
                                                <ErrorMessage name="institutions_representing" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-6/12'>
                                                <label htmlFor="belongs_to">What educational associations or groups belong to?</label>
                                                <Field
                                                    type="text"
                                                    name="belongs_to"
                                                    id="belongs_to"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    component="textarea"
                                                    rows="4"
                                                />
                                                <ErrorMessage name="belongs_to" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full mb-2'>
                                            <div className='flex flex-col m-2 w-6/12'>
                                                <label htmlFor="recruit_from">Where do you recruit from?</label>
                                                <Field
                                                    type="text"
                                                    name="recruit_from"
                                                    id="recruit_from"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    component="select"
                                                >

                                                    <option value="">--Select--</option>
                                                    <option value="NY">New York</option>
                                                    <option value="SF">San Francisco</option>
                                                    <option value="CH">Chicago</option>
                                                    <option value="OTHER">Other</option>
                                                </Field>
                                                <ErrorMessage name="recruit_from" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className="flex w-full form-control">
                                            <div className="flex flex-col m-2">
                                                <label htmlFor="">Approximately how many students do you send abroad per year?</label>
                                                <div className="flex">
                                                    {
                                                        state.student_to_abroad.map((item, index) => {
                                                            return (<span key={index} className='flex w-auto align-items-center justify-content-center mr-3 my-2'>
                                                                <label>
                                                                    <Field type="radio" value={item} name={`student_to_abroad`} id={`student_to_abroad_${index}`} className='m-1' />
                                                                    {item}
                                                                </label>
                                                            </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full form-control">
                                            <div className="flex flex-col m-2">
                                                <label htmlFor="">What type of marketing methods do you undertake?</label>
                                                <div className="flex">
                                                    {
                                                        state.marketing_methods.map((item, index) => {
                                                            return (<span key={index} className='flex w-auto align-items-center justify-content-center mr-3 my-2'>
                                                                <label htmlFor={`marketing_methods_${index}`}>
                                                                    <Field type="checkbox" name="marketing_methods" id={`marketing_methods_${index}`} value={item} className='m-1' />
                                                                    {item}
                                                                </label>
                                                            </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full form-control">
                                            <div className="flex flex-col m-2">
                                                <label htmlFor="">Average Service Fee</label>
                                                <div className="flex">
                                                    {
                                                        state.average_fee.map((item, index) => {
                                                            return (<span key={index} className='flex mr-3 my-2 w-auto align-items-center justify-content-center'>
                                                                <label>
                                                                    <Field type="radio" value={item} name={`average_fee`} id={`average_fee_${index}`} className='m-1' />
                                                                    {item}
                                                                </label>
                                                            </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full form-control">
                                            <div className="flex flex-col m-2">
                                                <label htmlFor="">Please provide an estimate of the number of students you will refer to Learn Global.</label>
                                                <div className="flex">
                                                    {
                                                        state.students_refer_to_learn_global.map((item, index) => {
                                                            return (<span key={index} className='flex mr-3 my-2 w-auto align-items-center justify-content-center'>
                                                                <label>
                                                                    <Field type="radio" value={item} name={`students_refer_to_learn_global`} id={`students_refer_to_learn_global_${index}`} className='m-1' />
                                                                    {item}
                                                                </label>
                                                            </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2  w-6/12'>
                                                <label htmlFor="reference_phone">Reference Phone</label>
                                                <Field
                                                    type="text"
                                                    name="reference_phone"
                                                    id="reference_phone"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="reference_phone" component="div" className="text-danger" />
                                            </div>
                                            <div className='flex flex-col m-2  w-6/12'>
                                                <label htmlFor="reference_website">Reference Website</label>
                                                <Field
                                                    type="text"
                                                    name="reference_website"
                                                    id="reference_website"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                />
                                                <ErrorMessage name="reference_website" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex flex-col m-2  w-6/12'>
                                                <label htmlFor="business_certificate">Business Certificate</label>
                                                <Field
                                                    type="file"
                                                    name="business_certificate"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    onChange={handleFiles}
                                                />
                                                {

                                                    state.business_certificate != "" ? <a className='text-primary' target={"_blank"} href={state.base_url + "/uploads/agent/" + state.business_certificate}>View Uploaded Document</a> : ""
                                                }

                                            </div>
                                            <div className='flex flex-col m-2  w-6/12'>
                                                <label htmlFor="company_logo">Company Logo</label>
                                                <Field
                                                    type="file"
                                                    name="company_logo"
                                                    className="border p-2  border-black disabled:opacity-75 disabled:bg-[#a8a29e] rounded form-control"
                                                    onChange={handleFiles}
                                                />
                                                {
                                                    state.company_logo != "" ? <a className='text-primary' target={"_blank"} href={state.base_url + "/uploads/agent/" + state.company_logo}>View Uploaded Document</a> : ""
                                                }

                                            </div>
                                        </div>
                                        <div className=''>
                                            <button className='m-2 py-2 px-4 bg-[#2a276b] hover:bg-[#1d1a52] text-white rounded' type="submit">
                                                Update
                                            </button>
                                        </div>
                                    </Form>
                                    <div className="shadow-xl m-4 p-2 rounded w-3/12">
                                        <div className="card-body">
                                            {/* <h5 className="card-title m-1 text-[#2a276b] font-bolder">Profile</h5> */}
                                            {
                                                state.status == "PENDING" ?
                                                    <p className="card-text m-1 text-[#2a276b]">Your Profile is under verification</p> :
                                                    state.status == "APPROVED" ?
                                                        <p className="card-text m-1 text-[green]">Your Profile is Approved</p> :
                                                        state.status == "REJECTED" &&
                                                        <p className="card-text m-1 text-[red]">Your Profile is Rejected</p>
                                            }
                                        </div>
                                        {/* <ul className="list-group list-group-flush">
                                            <li className="list-group-item">Registration Complete</li>
                                            <li className="list-group-item">Profile Pending!</li>
                                        </ul> */}
                                        <div className="flex items-center">
                                            {/* <div>
                                                <span class="text-danger text-bold">Pending</span>
                                            </div> */}
                                            {/* <button className="m-2 p-2 bg-[#2a276b] text-white rounded" onClick={refreshToken}>Refresh Status</button> */}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Formik>
                </>
            </div>
        </>
    )
}

export default AgentProfile