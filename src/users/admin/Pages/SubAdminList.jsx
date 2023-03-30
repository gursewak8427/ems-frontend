import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Navigate, redirect } from "react-router-dom";
import { authenticate, getToken } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const SubAdminList = () => {
    const [state, setState] = useState({
        isWaiting: false,
        list: [],
        adminToken: getToken("admin"),
        totalPages: 0,
        currentPage: 1,
        isPermissionPopupActive: false,
        activeUser: false,
        tempPermissions: [],
    })

    useEffect(() => {
        getPaginationData(1);
    }, [])

    const getPaginationData = (page) => {
        const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
        let data = { currentPage: page, role: "SUBADMIN" }
        axios.post(process.env.REACT_APP_NODE_URL + "/admin/adminlist", data, config).then(res => {
            console.log(res)
            setState({
                ...state,
                list: res.data.details.list,
                totalPages: res.data.details.totalPages,
                currentPage: res.data.details.currentPage,
                isWaiting: false,
            })
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    const togglePermission = (e) => {
        let oldTempPermissions = state.tempPermissions;
        if (oldTempPermissions.includes(e.target.value)) {
            let index = oldTempPermissions.indexOf(e.target.value)
            oldTempPermissions.splice(index, 1)
        } else {
            oldTempPermissions.push(e.target.value)
        }
        setState({
            ...state,
            tempPermissions: oldTempPermissions
        })
    }

    const savePermissions = () => {
        var data = {
            userId: state.activeUser,
            permissions: state.tempPermissions
        }
        const config = { headers: { "Authorization": `Bearer ${state.adminToken}` } }
        axios.post(process.env.REACT_APP_NODE_URL + "/admin/updatepermissions", data, config).then(res => {
            console.log({ res })
            alert(res.data.message)
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    return (
        <>
            <Dashboard heading_title={"Sub-Admin List"}>
                <>
                    {
                        state.isPermissionPopupActive && <div className="popup permissions">
                            <h2 className="flex justify-between items-center">
                                <span>Permissions</span>
                                <button onClick={() => {
                                    setState({
                                        ...state,
                                        activeUser: false,
                                        isPermissionPopupActive: false,
                                    })
                                }} className="text-[20px] m-2 py-1 px-4 rounded hover:bg-[#991b1b] bg-[#dc2626]">Close</button>
                            </h2>
                            <ol>
                                {/* <li>
                                    <label className="flex items-center" htmlFor="">
                                        <span>Dashboard</span>
                                        <ul>
                                            <li></li>
                                        </ul>
                                    </label>
                                </li> */}
                                <li>
                                    <label className="flex items-center" htmlFor="">
                                        {
                                            state.tempPermissions.includes("csv_programs") ?
                                                <input name="permission" value="csv_programs" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                <input name="permission" value="csv_programs" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                        }
                                        <span>CSV programs</span>
                                    </label>
                                </li>
                                <li>
                                    <label className="flex items-center" htmlFor=""> {
                                        state.tempPermissions.includes("school_main") ?
                                            <input name="permission" value="school_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                            <input name="permission" value="school_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                    }Schools/Programs</label>
                                    <ul>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("sp_country_names") ?
                                                    <input name="permission" value="sp_country_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="sp_country_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>Add Country Names</span>
                                        </li>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("sp_school_names") ?
                                                    <input name="permission" value="sp_school_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="sp_school_names" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>Add School Names</span>
                                        </li>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("sp_list") ?
                                                    <input name="permission" value="sp_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="sp_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>School/Program list</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <label className="flex items-center" htmlFor=""> {
                                        state.tempPermissions.includes("subadmin_main") ?
                                            <input name="permission" value="subadmin_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                            <input name="permission" value="subadmin_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                    }Sub-Admin</label>
                                    <ul>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("subadmin_create") ?
                                                    <input name="permission" value="subadmin_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="subadmin_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>Create</span>
                                        </li>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("subadmin_list") ?
                                                    <input name="permission" value="subadmin_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="subadmin_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>List</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <label className="flex items-center" htmlFor="">
                                        {
                                            state.tempPermissions.includes("counselor_main") ?
                                                <input name="permission" value="counselor_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                <input name="permission" value="counselor_main" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                        }
                                        Counselor
                                    </label>
                                    <ul>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("counselor_create") ?
                                                    <input name="permission" value="counselor_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="counselor_create" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>Create</span>
                                        </li>
                                        <li className="flex items-center">
                                            {
                                                state.tempPermissions.includes("counselor_list") ?
                                                    <input name="permission" value="counselor_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" checked /> :
                                                    <input name="permission" value="counselor_list" onChange={togglePermission} className="mx-2 w-[20px] h-[20px]" type="checkbox" />
                                            }
                                            <span>List</span>
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                            <button className="float-right mb-10 m-2 py-2 px-5 bg-[#2a276b] hover:bg-[#2a266bb4] text-white rounded-full" onClick={savePermissions}>Update</button>
                        </div>
                    }

                    <div className="w-full">
                        <div className="w-full">
                            <div className="w-full">
                                <div className="shadow-lg m-5">
                                    <div className="p-4 h-[80vh]">
                                        <table className="table w-full mb-0">
                                            <thead>
                                                <tr className="bg-[#cbd5e1]">
                                                    <th className="p-2 ">Id</th>
                                                    <th className="p-2 ">Name</th>
                                                    <th className="p-2 text-center ">Email</th>
                                                    <th className="p-2 text-center ">Created</th>
                                                    <th className="p-2 text-secondary opacity-7" />
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    state.list.map((student, index) => {
                                                        return <tr className="w-full border-bottom border-2">
                                                            <td className="p-2 text-center">
                                                                <p className="text-xs font-weight-bold mb-0">{index + 1}</p>
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <div className="d-flex px-2 py-1">
                                                                    <div className="d-flex flex-column justify-content-center">
                                                                        <h6 className="mb-0">{student.first_name + " " + student.last_name || "SubAdmin"}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-2 align-middle text-center">
                                                                <span className="badge badge-sm bg-gradient-success">{student.email}</span>
                                                            </td>
                                                            <td className="p-2 align-middle text-center">
                                                                <span className="text-secondary text-xs font-weight-bold">{student?.created || ""}</span>
                                                            </td>
                                                            <td className="p-2 align-middle">
                                                                <span className="text-[#2a276b] font-bolder cursor-pointer" onClick={() => {
                                                                    setState({
                                                                        ...state,
                                                                        activeUser: student._id,
                                                                        isPermissionPopupActive: true,
                                                                        tempPermissions: state.list[index].permissions
                                                                    })
                                                                }}>
                                                                    Permissions
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>

                                    </div>
                                    <div className="pb-0">
                                        {/* pagination is here */}
                                        <div className="pagination">
                                            <div className="pages">
                                                <ReactPaginate
                                                    breakLabel="..."
                                                    nextLabel="next"
                                                    onPageChange={(event) => {
                                                        getPaginationData(event.selected + 1)
                                                    }}
                                                    pageRangeDisplayed={2}
                                                    pageCount={state.totalPages}
                                                    previousLabel="prev"
                                                    renderOnZeroPageCount={null}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </Dashboard>
        </>
    )
}

export default SubAdminList;