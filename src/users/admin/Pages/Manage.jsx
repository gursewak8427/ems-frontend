import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { authenticate } from "../../../helper/auth";
import Dashboard from "../Screens/Dashboard/Dashboard";
import "./Manage.css";

const Manage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    isWaiting: true,
    agents: [],
    students: [],
    totalPages: 0,
    currentPage: 1,
    filterActive: false,
    activeAgentDetails: null,
    onlyDetails: [],
  });

  const toggleFilteredBox = () =>
    setState({ ...state, filterActive: !state.filterActive });

  const setActiveAgentDetails = (index) =>
    setState({ ...state, activeAgentDetails: index });

  useEffect(() => {
    getPaginationData(1);
  }, [searchParams.get("status")]);

  const getPaginationData = (page) => {
    const agentId = searchParams.get("id");

    // // getprofile
    // if (agentId) {
    //     axios.post(process.env.REACT_APP_NODE_URL + "/admin/getagents", data).then(res => {
    //         console.log(res)
    //         // authenticate with token
    //         // redirect

    //         if (agentId) {
    //             var getIndex = res.data.details.agents.reduce((prev, curr, index) => curr._id == agentId ? index : prev, 0)
    //             setState({
    //                 ...state,
    //                 onlyDetails: [res.data.details.agent],
    //                 isWaiting: false,
    //             })
    //         }

    //     }).catch(err => {
    //         console.log(err.response.data)
    //         // alert(err.response.data.message)
    //     })
    // }

    // get all agents

    setState({
      ...state,
      isWaiting: true,
    });
    let status = searchParams.get("status") || "";
    let data = { currentPage: page, status };
    setState({
      ...state,
      isWaiting: true,
    });
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/getagents", data)
      .then((res) => {
        console.log(res);
        // authenticate with token
        // redirect

        setState({
          ...state,
          isWaiting: false,
          agents: res.data.details.agents,
          totalPages: res.data.details.totalPages,
          currentPage: res.data.details.currentPage,
          isWaiting: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };
  const toggleStatus = (agentId, index, e) => {
    if (!window.confirm("Are you confirm ?")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    let oldAgents = state.agents;
    oldAgents[index].status = e.target.value;
    // if (oldAgents[index].status == "APPROVED") {
    //     oldAgents[index].status = "UN_APPROVED";
    // } else {
    // oldAgents[index].status = "APPROVED";
    // }
    setState({
      ...state,
      agents: oldAgents,
    });
    let count = parseInt(
      document.getElementById("totalAgentsUnapproved").innerText
    );
    if (e.target.value == "UN_APPROVED") {
      document.getElementById("totalAgentsUnapproved").innerText = count + 1;
    } else {
      document.getElementById("totalAgentsUnapproved").innerText = count - 1;
    }
    let data = { agentId, status: e.target.value };
    axios
      .post(process.env.REACT_APP_NODE_URL + "/admin/togglestatus", data)
      .then((res) => {
        console.log(res);
        // authenticate with token
        // redirect
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert(err.response.data.message)
      });
  };
  const AsideBarAgentDetails = () => <></>;

  // const AsideBarAgentDetails = () =>
  //     <aside className={`agentDetailsAsideBar ${state.activeAgentDetails != null ? "active" : ""}`}>
  //         <h1>
  //             Agent Details
  //             <button onClick={() => {
  //                 setState({ ...state, activeAgentDetails: null })
  //                 navigate("/d/admin/manage?status=unapproved")
  //             }}>Close</button>
  //         </h1>
  //         <div className="flex">
  //             <table className="table-responsive w-9/12">
  //                 <h2>Basic</h2>
  //                 <tr className="py-0">
  //                     <div className="p-2 flex flex-col">
  //                         <th>Username :</th>
  //                         <td className="capitalize">{state.agents[state.activeAgentDetails || 0]?.username || ""}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Email :</th>
  //                         <td className="lowercase">{state.agents[state.activeAgentDetails || 0]?.email || ""}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>First Name :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.first_name}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Last Name :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.last_name}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Phone :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.phone || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th></th>
  //                         <td></td>
  //                     </div>
  //                 </tr>
  //                 <h2>Address</h2>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Street :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.street || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>City :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.city || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>State :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.state || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Country :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.country || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Postal Code :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.postal_code || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th></th>
  //                         <td></td>
  //                     </div>
  //                 </tr>
  //                 <h2>Company Details</h2>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Principal Country of Business :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.principal_country_of_business || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Company Name :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.company_name || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Cellphone :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.cellphone || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Facebook Page :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.facebook_page_name || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Skype Id :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.skype_ID || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Whatsapp Id :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.whatsapp_ID || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Instagram Handle :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.instagram_handle || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Twitter Handle :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.twitter_handle || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Linkedin :</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.linkedin_URL || "---"}</td>
  //                     </div>
  //                 </tr>
  //                 <h2>Recruitment details</h2>
  //                 <tr className="question_row">
  //                     <li className="question">When did you begin recruiting students?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.begin_recruiting_students || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">What services do you provide to your clients?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.linkedin_URL || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">Canadian Schools Represented</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.canadaian_schools_represented || "No"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">American Schools Represented</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.american_schools_represented || "No"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">Represents Other Countries</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.represents_other_countries || "No"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">What institutions are you representing?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.institutions_representing || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">What educational associations or groups belong to?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.belongs_to || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">Where do you recruit from?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.recruit_from || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">Approximately how many students do you send abroad per year?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.student_to_abroad || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">What type of marketing methods do you undertake?</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.marketing_methods.join(",") || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">Average Service Fee</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.average_fee || "---"}</li>
  //                 </tr>
  //                 <tr className="question_row">
  //                     <li className="question">Please provide an estimate of the number of students you will refer to Learn Global.</li>
  //                     <li className="answer">{state.agents[state.activeAgentDetails || 0]?.students_refer_to_learn_global || "---"}</li>
  //                 </tr>
  //                 <h2>Refrence Details</h2>
  //                 <tr>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Phone</th>
  //                         <td>{state.agents[state.activeAgentDetails || 0]?.reference_phone || "---"}</td>
  //                     </div>
  //                     <div className="p-2 flex flex-col">
  //                         <th>Website</th>
  //                         <td className="lowercase">{state.agents[state.activeAgentDetails || 0]?.reference_website || "---"}</td>
  //                     </div>
  //                 </tr>
  //             </table>
  //             <div className="right w-3/12">
  //                 <div className="profile-image">
  //                     <label htmlFor="">Profile Image</label>
  //                     {
  //                         state.agents[state.activeAgentDetails || 0]?.profile_image ?
  //                             <img src={`http://localhost:3006/uploads/agent/${state.agents[state.activeAgentDetails || 0]?.profile_image}`} alt="" /> :
  //                             <>Pending</>
  //                     }
  //                 </div>
  //                 <div className="company-logo">
  //                     <label htmlFor="">Company Logo</label>
  //                     {
  //                         state.agents[state.activeAgentDetails || 0]?.company_logo ?
  //                             <img src={`http://localhost:3006/uploads/agent/${state.agents[state.activeAgentDetails || 0]?.company_logo}`} alt="" /> :
  //                             <>Pending</>
  //                     }
  //                 </div>
  //                 <div className="certificate-pdf">
  //                     <label htmlFor="">Business Certificate</label>
  //                     {
  //                         state.agents[state.activeAgentDetails || 0]?.business_certificate ?
  //                             <>
  //                                 <p className="text-center text-sm">{state.agents[state.activeAgentDetails || 0]?.business_certificate}</p>
  //                                 <span onClick={() => window.open(`http://localhost:3006/uploads/agent/${state.agents[state.activeAgentDetails || 0]?.business_certificate}`, "_blank")}>Open</span>
  //                             </> :
  //                             <>Pending</>
  //                     }

  //                 </div>
  //             </div>
  //         </div>
  //     </aside>

  return (
    <>
      <div heading_title={"Agents List"}>
        <>
          <div className="row px-4">
            <div className="w-full lg:p-45 mt-10">
              <div className="shadow-lg mb-4 mt-4 border agent-table">
                <div className="px-0 pt-0 pb-2">
                  <div className="table-responsive p-0">
                    <table className="table w-full mb-0">
                      <thead>
                        <tr>
                          <th className="">Id</th>
                          <th className="text-left p-3">Name</th>
                          <th className="">Phone</th>
                          <th className="">Approved</th>
                          <th className="text-secondary opacity-7" />
                        </tr>
                      </thead>
                      <tbody>
                        {state.isWaiting ? (
                          <></>
                        ) : (
                          state.agents.map((agent, index) => {
                            return (
                              <tr>
                                <td className="border-2">
                                  <p className="text-xs text-center font-weight-bold mb-0">
                                    {index + 1}
                                  </p>
                                  {/* <p className="text-xs text-secondary mb-0"><b>ID:</b> {agent._id}</p> */}
                                </td>
                                <td className="p-1 border-2 ">
                                  <div className="flex jusify-center px-2 py-1">
                                    <div>
                                      <img
                                        width={"50px"}
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
                                        className="avatar avatar-sm mr-2"
                                        alt="user1"
                                      />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                      <h6
                                        className="mb-0 text-sm font-bolder text-[#2a276b] capitalize hover:underline cursor-pointer"
                                        onClick={() =>
                                          navigate(
                                            "/d/admin/agentprofile?id=" +
                                              agent._id
                                          )
                                        }
                                      >
                                        <b>{agent.first_name}</b>
                                      </h6>
                                      <p className="text-xs text-secondary mb-0 lowercase">
                                        {agent.username}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle text-center border-2">
                                  <span className="text-secondary text-xs font-weight-bold">
                                    {agent.phone}
                                  </span>
                                </td>
                                <td className="align-middle text-center text-sm border-2">
                                  {agent.status == "PENDING" ? (
                                    <select
                                      name=""
                                      id=""
                                      className="px-4 py-2 border-2 border-gray"
                                      onChange={(e) =>
                                        toggleStatus(agent._id, index, e)
                                      }
                                    >
                                      <option
                                        value=""
                                        className="border-2 border-gray px-4 py-2"
                                      >
                                        -- PENDING --
                                      </option>
                                      <option
                                        value="APPROVED"
                                        className="border-2 border-gray px-4 py-2"
                                      >
                                        APPROVE
                                      </option>
                                      <option
                                        value="REJECT"
                                        className="border-2 border-gray px-4 py-2"
                                      >
                                        REJECT
                                      </option>
                                    </select>
                                  ) : agent.status == "APPROVED" ? (
                                    <div className="text-[green]">Approved</div>
                                  ) : agent.status == "REJECT" ? (
                                    <div className="text-[red]">Rejected</div>
                                  ) : (
                                    <></>
                                  )}
                                  {
                                    //         <input className="checkboxstyle" type="checkbox" name="" id="" onClick={(e) => {
                                    //             if (window.confirm("Are you sure ?")) {
                                    //                 toggleStatus(agent._id, index)
                                    //             } else {
                                    //                 e.preventDefault();
                                    //                 e.stopPropagation();
                                    //                 return false;
                                    //             }
                                    //         }
                                    //         } defaultChecked /> :
                                    //         // <Switch color="secondary" defaultChecked onClick={() => toggleStatus(agent._id)} /> :
                                    //         agent.status == "UN_APPROVED" ?
                                    //             <input className="checkboxstyle" type="checkbox" name="" id="" onClick={(e) => {
                                    //                 if (window.confirm("Are you sure ?")) {
                                    //                     toggleStatus(agent._id, index)
                                    //                 } else {
                                    //                     e.preventDefault();
                                    //                     e.stopPropagation();
                                    //                     return false;
                                    //                 }
                                    //             }} /> : ""
                                    //     // <Switch color="secondary" onClick={() => toggleStatus(agent._id)} /> : ""
                                  }

                                  {/* <span className="badge badge-sm bg-gradient-success">Online</span> */}
                                </td>

                                <td className="align-middle text-center border-2">
                                  <Link
                                    to={"/d/admin/agent_students/" + agent._id}
                                    className="capitalize text-secondary font-weight-bold text-xs"
                                    data-toggle="tooltip"
                                    data-original-title="Edit user"
                                  >
                                    Students
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                    {state.isWaiting ? (
                      <center className="w-full my-10">
                        <img
                          width={80}
                          src="https://i.gifer.com/ZZ5H.gif"
                          alt=""
                        />
                      </center>
                    ) : (
                      <></>
                    )}
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
                          getPaginationData(event.selected + 1);
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
        </>
      </div>
      {<AsideBarAgentDetails />}
    </>
  );
};

export default Manage;
