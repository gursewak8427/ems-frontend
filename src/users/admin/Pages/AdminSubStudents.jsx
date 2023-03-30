import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Navigate, redirect, useParams } from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";

const AdminSubStudents = () => {
    const { agentId } = useParams()
    const [state, setState] = useState({
        isWaiting: true,
        students: [],
        totalPages: 0,
        currentPage: 1,
    })

    useEffect(() => {
        getPaginationData(1);
    }, [])

    const getPaginationData = (page) => {
        let data = { currentPage: page, agentId: agentId }
        axios.post(process.env.REACT_APP_NODE_URL + "/admin/getstudents", data).then(res => {
            console.log(res)
            // authenticate with token
            // redirect
            setState({
                ...state,
                isWaiting: false,
                students: res.data.details.students,
                totalPages: res.data.details.totalPages,
                currentPage: res.data.details.currentPage,
            })
        }).catch(err => {
            console.log(err.response.data)
            // alert(err.response.data.message)
        })
    }

    return (
        <>
            <div heading_title={"Agent's Students (" + agentId + ")"}>
                <>
                    <div className="row min-height-vh-100">
                        <h1 className="p-4 font-black">{`Agent's Students (${agentId})`}</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card mb-4">
                                    {/* <div className="card-header pb-0">
                                        <h6>Agent's Student</h6>
                                    </div> */}
                                    <div className="card-body px-0 pt-0 pb-2">
                                        <div className="table-responsive p-4">
                                            <table className="table mb-0 w-full">
                                                <thead>
                                                    <tr className="bg-[gray]">
                                                        <th className="p-2 text-left">Id</th>
                                                        <th className="p-2 text-left">Name</th>
                                                        {/* <th className="p-2 align-middle text-center ">Status</th> */}
                                                        <th className="p-2 align-middle text-center ">Joining</th>
                                                        {/* <th className="p-2 text-secondary opacity-7" /> */}
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        state.students.map((student, index) => {
                                                            return <tr>
                                                                <td className="p-2 max-width">
                                                                    <p className="text-xs font-weight-bold mb-0">{index + 1}</p>
                                                                    {/* <p className="text-xs text-secondary mb-0"><b>ID:</b> {student._id}</p> */}
                                                                </td>
                                                                <td className="p-2 text-left">
                                                                    <div className="d-flex px-2 py-1">
                                                                        {/* <div>
                                                                            <img src="../../assets/img/team-2.jpg" className="avatar avatar-sm me-3" alt="user1" />
                                                                        </div> */}
                                                                        <div className="d-flex flex-column justify-content-center">
                                                                            <h6 className="mb-0 text-sm">{student.firstName || "--"}</h6>
                                                                            <p className="text-xs text-secondary mb-0">{student.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                {/* <td className="p-2 text-center">
                                                                    <span className="badge badge-sm bg-gradient-success">Active</span>
                                                                </td> */}
                                                                <td className="align-middle text-center">
                                                                    <span className="text-secondary text-xs font-weight-bold">23/04/18</span>
                                                                </td>
                                                                {/* <td className="align-middle">
                                                                    <a href="javascript:;" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                                                        Edit
                                                                    </a>
                                                                </td> */}
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-footer pb-0">
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
            </div>
        </>
    )
}

export default AdminSubStudents;