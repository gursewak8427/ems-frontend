import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { authenticate, getToken } from "../../../helper/auth";
import ButtonPrimary from '../../../common/Buttons/ButtonPrimary';
import { toast } from 'react-toastify';

export const Security = () => {
  const [state, setState] = useState({
    isWaiting: false,
    notifications: [],
    adminToken: getToken("admin"),
    btnLoading: {
      profile: false,
      password: false,
    }
  })
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')



  const updateData = () => {
    setState({
      ...state,
      btnLoading: {
        profile: true,
        password: false,
      }
    })
    const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
    let data = { firstName: firstName, lastName: lastName }
    axios.patch(process.env.REACT_APP_NODE_URL + "/admin/updateProfile", data, config).then(res => {
      setState({
        ...state,
        btnLoading: {
          profile: false,
          password: false,
        }
      })
      if (res.data.status == "0") {
        toast.error(res.data.message);
      } else {
        document.getElementById("header-firstname").innerText = firstName
        toast(res.data.message);
      }
    }).catch(err => {
      setState({
        ...state,
        btnLoading: {
          profile: false,
          password: false,
        }
      })
      toast.error(err?.response?.data?.message || "Something went wrong");
      console.log(err.response.data)
      // alert(err.response.data.message)
    })
  }

  const updatePassword = () => {
    if (oldPassword != "" && newPassword != "") {
      if (newPassword !== confirmPassword) {
        toast.error("Both password must be same!");
        return;
      }
      setState({
        ...state,
        btnLoading: {
          profile: false,
          password: true,
        }
      })
      const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
      let data = { oldPassword: oldPassword, newPassword: newPassword }
      axios.patch(process.env.REACT_APP_NODE_URL + "/admin/changePassword", data, config).then(res => {
        console.log(res)
        if (res.data.status == "0") {
          toast.error(res.data.message);
        } else {
          toast(res.data.message);
        }

        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')

        setState({
          ...state,
          btnLoading: {
            profile: false,
            password: false,
          }
        })
      }).catch(err => {
        console.log(err.response.data)
        toast.error(err?.response?.data?.message || "Something went wrong");
        setState({
          ...state,
          btnLoading: {
            profile: false,
            password: false,
          }
        })
        // alert(err.response.data.message)
      })
    } else {
      toast.error("kindly check password field again");
    }

  }


  useEffect(() => {
    const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
    axios
      .get(process.env.REACT_APP_NODE_URL + "/admin/profile", config).then(response => {
        console.log(response)

        if (response.data.status == "1") {
          setEmail(response.data.details.user.email)
          setFirstName(response.data.details.user.first_name)
          setLastName(response.data.details.user.last_name)
        }
      })

  }, [])



  return (
    <div className='profile-main'>
      <h1 className='m-2 font-black text-xl'>Change Password</h1>

      <div
        class="block max-w-sm flex-none w-64 bg-white p-6 lg:m-10 profile-form">
        <div class="relative mb-6" data-te-input-wrapper-init>
          <label>Old Password</label>
          <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 motion-reduce:transition-none text-[black]"
            id="exampleInput90"
            placeholder="Old Password"
            value={oldPassword}
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
            value={newPassword}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <ButtonPrimary title={"Change Password"} loading={state.btnLoading.password} onclick={updatePassword} />
        {/* <button
          type="button"
          class="rounded bg-blue px-6 py-2.5 text-xs border-2 font-medium uppercase leading-tight text-black shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={updatePassword}
        >
          Change Password
        </button> */}
      </div>
    </div>
  )
}

