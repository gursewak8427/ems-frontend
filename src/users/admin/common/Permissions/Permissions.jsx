// import axios from "axios";
// import { useEffect, useState } from "react";
// import ReactPaginate from "react-paginate";
// import { Navigate, redirect } from "react-router-dom";
// import { authenticate, getToken } from "../../../helper/auth";
// import Dashboard from "../Screens/Dashboard/Dashboard";

// const Permissions = () => {
//     const [state, setState] = useState({
//         isWaiting: false,
//         list: [],
//         adminToken: getToken("admin"),
//         totalPages: 0,
//         currentPage: 1,
//         activeUser: false,
//         tempPermissions: [],
//     })

//     useEffect(() => {
//         getPaginationData(1);
//     }, [])

//     const getPaginationData = (page) => {
//         const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
//         let data = { currentPage: page, role: "SUBADMIN" }
//         axios.post(process.env.REACT_APP_NODE_URL + "/admin/adminlist", data, config).then(res => {
//             console.log(res)
//             setState({
//                 ...state,
//                 list: res.data.details.list,
//                 totalPages: res.data.details.totalPages,
//                 currentPage: res.data.details.currentPage,
//                 isWaiting: false,
//             })
//         }).catch(err => {
//             console.log(err.response.data)
//         })
//     }

//     const togglePermission = (e) => {
//         let oldTempPermissions = state.tempPermissions;
//         if (oldTempPermissions.includes(e.target.value)) {
//             let index = oldTempPermissions.indexOf(e.target.value)
//             oldTempPermissions.splice(index, 1)
//         } else {
//             oldTempPermissions.push(e.target.value)
//         }
//         setState({
//             ...state,
//             tempPermissions: oldTempPermissions
//         })
//     }

//     const savePermissions = () => {
//         var data = {
//             userId: state.activeUser,
//             permissions: state.tempPermissions
//         }
//         const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
//         axios.post(process.env.REACT_APP_NODE_URL + "/admin/updatepermissions", data, config).then(res => {
//             console.log({ res })
//             alert(res.data.message)
//         }).catch(err => {
//             console.log(err.response.data)
//         })
//     }

//     return (
//         <>
//             <div className="popup permissions">
//                 <h2 className="flex justify-between items-center">
//                     <span>Permissions</span>
//                     <button onClick={() => {
//                         setState({
//                             ...state,
//                             activeUser: false,
//                         })
//                     }} className="text-[20px] m-2 py-1 px-4 rounded hover:bg-[#991b1b] bg-[#dc2626]">Close</button>
//                 </h2>
//                 <ol>
//                     {/* <li>
//                                     <label className="flex items-center" htmlFor="">
//                                         <span>Dashboard</span>
//                                         <ul>
//                                             <li></li>
//                                         </ul>
//                                     </label>
//                                 </li> */}
//                     <li>
//                         <label className="flex items-center" htmlFor="">
//                             {
//                                 state.tempPermissions.includes("csv_programs") ?
//                                     <input name="permission" value="csv_programs" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                     <input name="permission" value="csv_programs" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                             }
//                             <span>CSV programs</span>
//                         </label>
//                     </li>
//                     <li>
//                         <label className="flex items-center" htmlFor=""> {
//                             state.tempPermissions.includes("school_main") ?
//                                 <input name="permission" value="school_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                 <input name="permission" value="school_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                         }Schools/Programs</label>
//                         <ul>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("sp_country_names") ?
//                                         <input name="permission" value="sp_country_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="sp_country_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>Add Country Names</span>
//                             </li>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("sp_school_names") ?
//                                         <input name="permission" value="sp_school_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="sp_school_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>Add School Names</span>
//                             </li>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("sp_list") ?
//                                         <input name="permission" value="sp_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="sp_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>School/Program list</span>
//                             </li>
//                         </ul>
//                     </li>
//                     <li>
//                         <label className="flex items-center" htmlFor=""> {
//                             state.tempPermissions.includes("subadmin_main") ?
//                                 <input name="permission" value="subadmin_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                 <input name="permission" value="subadmin_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                         }Sub-Admin</label>
//                         <ul>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("subadmin_create") ?
//                                         <input name="permission" value="subadmin_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="subadmin_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>Create</span>
//                             </li>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("subadmin_list") ?
//                                         <input name="permission" value="subadmin_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="subadmin_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>List</span>
//                             </li>
//                         </ul>
//                     </li>
//                     <li>
//                         <label className="flex items-center" htmlFor="">
//                             {
//                                 state.tempPermissions.includes("counselor_main") ?
//                                     <input name="permission" value="counselor_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                     <input name="permission" value="counselor_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                             }
//                             Counselor
//                         </label>
//                         <ul>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("counselor_create") ?
//                                         <input name="permission" value="counselor_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="counselor_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>Create</span>
//                             </li>
//                             <li className="flex items-center">
//                                 {
//                                     state.tempPermissions.includes("counselor_list") ?
//                                         <input name="permission" value="counselor_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
//                                         <input name="permission" value="counselor_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
//                                 }
//                                 <span>List</span>
//                             </li>
//                         </ul>
//                     </li>
//                 </ol>
//                 <button className="float-right mb-10 m-2 py-2 px-5 bg-[#2a276b] hover:bg-[#2a266bb4] text-white rounded-full" onClick={savePermissions}>Update</button>
//             </div>
//         </>
//     )
// }

// export default Permissions;