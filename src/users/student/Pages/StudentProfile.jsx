import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { authenticate, getToken } from "../../../helper/auth";

export const StudentProfile = () => {
  const [state, setState] = useState({
    isWaiting: false,
    notifications: [],
    adminToken: getToken("student"),
  })
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')




  const updateData = () => {
    const config = {
        headers: {
          Authorization: `Bearer ${getToken("student")
            }`
        }
      };
    let data = { firstName: firstName, lastName: lastName }
    axios.patch(process.env.REACT_APP_NODE_URL + "/student/", data, config).then(res => {
      console.log(res)
      alert(res.data.message)
    }).catch(err => {
      console.log(err.response.data)
      // alert(err.response.data.message)
    })
  }

  const updatePassword = () => {
    // if (oldPassword != "" && newPassword != "") {
    //   if (newPassword !== confirmPassword) {
    //     alert("Both password must be same!")
    //     return;
    //   }
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${getToken("student")
    //         }`
    //     }
    //   };
    //   let data = { oldPassword: oldPassword, newPassword: newPassword }
    //   axios.patch(process.env.REACT_APP_NODE_URL + "/admin/changePassword", data, config).then(res => {
    //     console.log(res)
    //     alert(res.data.message)
    //   }).catch(err => {
    //     console.log(err.response.data)
    //     // alert(err.response.data.message)
    //   })
    // } else {
    //   alert('kindly check password field again');
    // }

  }


  useEffect(() => {
    const config = {
        headers: {
          Authorization: `Bearer ${getToken("student")
            }`
        }
      };
    axios
      .get(process.env.REACT_APP_NODE_URL + "/student/", config).then(response => {
        console.log(response)

        if (response.data.status == "1") {
          setEmail(response.data.details.student.email)
          setFirstName(response.data.details.student.firstName)
          setLastName(response.data.details.student.lastName)
        }
      })

  }, [])



  return (
    <div  className='lg:flex profile-main'>
      <div
        class="block max-w-sm flex-none w-64  rounded-lg bg-white p-6 lg:m-10 shadow-lg profile-form">

        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>First Name</label>
          <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput90"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

        </div>
        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>Last Name</label>
          <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput90"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

        </div>
        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>Email address</label>
          <input
            type="email"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput91"
            value={email} />

        </div>

        <button
          type="button"
          class="rounded bg-blue px-6 py-2.5 text-xs border-2 font-medium uppercase leading-tight text-black shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={updateData}>
          Update
        </button>

      </div>
      <div
        class="block max-w-sm flex-none w-64  rounded-lg bg-white p-6 lg:m-10 shadow-lg profile-form">
        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>Old Password</label>
          <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput90"
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
          />

        </div>
        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>New Password</label>
          <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput90"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />

        </div>
        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>Confirm Password</label>
          <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput91"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          class="rounded bg-blue px-6 py-2.5 text-xs border-2 font-medium uppercase leading-tight text-black shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={updatePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  )
}

