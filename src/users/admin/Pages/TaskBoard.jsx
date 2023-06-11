import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { getToken } from '../../../helper/auth';
import ButtonPrimary from '../../../common/Buttons/ButtonPrimary';
const { v4: uuid } = require('uuid');


const TaskBoard = () => {
    const [itemsFromBackend, setItemsFromBackend] = useState([
        { id: uuid(), content: 'First task', description: 'Task description 1', status: 'Requested' },
        { id: uuid(), content: 'Second task', description: 'Task description 2', status: 'To do' },
        { id: uuid(), content: 'Third task', description: 'Task description 3', status: 'In Progress' },
        { id: uuid(), content: 'Fourth task', description: 'Task description 4', status: 'Done' },
        { id: uuid(), content: 'Fifth task', description: 'Task description 5', status: 'Done' },
    ])

    const [Modal, setModal] = useState(false);
    const [activeColIndex, setActiveColIndex] = useState(false);
    const [activeTaskIndex, setActiveTaskIndex] = useState(false);


    // "PENDING", // Only created not assigned
    // "ASSIGNED", // Assign to one team and set responsible team-leader(s)
    // "IN_PROCESS", // When user is worked on the task
    // "SUBMITTED", // When the task is completed and submitted to the team-leader then it gone to testing mode
    // "LATE_SUBMITTED", // If submit the task after dead-line
    // "TESTING", // Testing phase
    // "COMPLETE", // IF testing paas
    // "FAILED",
    const [initialColumns, setInitialColumns] = useState({
        [uuid()]: {
            name: 'PENDING',
            items: [],
        },
        [uuid()]: {
            name: 'ASSIGNED',
            items: [],
        },
        [uuid()]: {
            name: 'IN_PROCESS',
            items: [],
        },
        [uuid()]: {
            name: 'SUBMITTED',
            items: [],
        },
        [uuid()]: {
            name: 'TESTING',
            items: [],
        },
        [uuid()]: {
            name: 'FAILED',
            items: [],
        },
        [uuid()]: {
            name: 'COMPLETE',
            items: [],
        },
    })

    const { teamId } = useParams()
    const [state, setState] = useState({
        isWait: true,
        list: [],
        userId: "",
        teamDetail: {},
        submit_data: ""
    });


    var config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
    useEffect(() => {
        console.log(config);
        axios
            .get(process.env.REACT_APP_NODE_URL + `/tasks/getTeamTasks/${teamId}`, config)
            .then((teamResponse) => {
                console.log(teamResponse);
                if (teamResponse.data.status == "1") {
                    setState({
                        ...state,
                        list: teamResponse.data.details.tasks,
                        userId: teamResponse.data.details.userId,
                        teamDetail: teamResponse.data.details.teamDetail,
                        isWait: false
                    });
                    console.log(teamResponse.data.details.tasks);
                    setItemsFromBackend(teamResponse.data.details.tasks)
                    let newColumns = {
                        [uuid()]: {
                            name: 'PENDING',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'PENDING').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                        [uuid()]: {
                            name: 'ASSIGNED',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'ASSIGNED').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                        [uuid()]: {
                            name: 'IN_PROCESS',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'IN_PROCESS').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                        [uuid()]: {
                            name: 'SUBMITTED',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'SUBMITTED').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                        [uuid()]: {
                            name: 'TESTING',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'TESTING').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                        [uuid()]: {
                            name: 'FAILED',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'FAILED').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                        [uuid()]: {
                            name: 'COMPLETE',
                            items: teamResponse.data.details.tasks.filter(task => task.status === 'COMPLETE').sort(function (a, b) {
                                return a.columnIndex - b.columnIndex
                            }),
                        },
                    }
                    console.log({ newColumns });
                    setColumns(newColumns)
                }
            });
    }, []);


    const [columns, setColumns] = useState(initialColumns);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newColumnName, setNewColumnName] = useState('');

    const handleDragEnd = async result => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {

            const sourceColumn = columns[source.droppableId];
            const destinationColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destinationItems = [...destinationColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destinationItems.splice(destination.index, 0, removed);


            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destinationColumn,
                    items: destinationItems,
                },
            });

            let task = removed;
            task.columnIndex = destination.index;
            task.status = destinationColumn.name;
            let data = {
                SI: source.index,
                DI: destination.index,
            }
            let statusData = {
                SS: sourceColumn.name,
                DS: destinationColumn.name
            }
            await axios
                .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`,
                    { task, isUpdateColumnIndex: true, data, statusData }
                )

        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });

            let task2 = removed;
            task2.columnIndex = destination.index;
            let data = {
                SI: source.index,
                DI: destination.index,
            }
            let statusData = {
                SS: removed.status,
                DS: removed.status
            }
            await axios
                .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`, { task: task2, isUpdateColumnIndex: true, data, statusData })

        }
    };

    const handleAddColumn = () => {
        if (newColumnName.trim() === '') return;
        const newColumnId = uuid();
        setColumns({
            ...columns,
            [newColumnId]: {
                name: newColumnName,
                items: [],
            },
        });
        setNewColumnName('');
    };

    const handleRemoveColumn = columnId => {
        const updatedColumns = { ...columns };
        delete updatedColumns[columnId];
        setColumns(updatedColumns);
    };

    const openTaskPopup = async (colIndex, itemIndex, taskId) => {
        const task = Object.values(columns)
            .flatMap(column => column.items)
            .find(item => item._id === taskId);
        console.log({ colIndex, itemIndex });
        setActiveColIndex(colIndex);
        setActiveTaskIndex(itemIndex);
        setSelectedTask(task);
        setCurrentEmpList(columns[colIndex].items[itemIndex]?.employee_ids)
    };

    const closeTaskPopup = () => {
        alert("Are you want to close ?")
        window.location.reload();
    };

    const finalUpdateEmpList = async () => {
        let oldEmpList = [...currentEmpList];
        let newCol;
        let oldCol = columns;
        console.log({ oldEmpList, activeColIndex, activeTaskIndex });
        columns[activeColIndex].items[activeTaskIndex].employee_ids = oldEmpList;
        let oldTasks = [...columns[activeColIndex].items]
        oldTasks[activeTaskIndex] = columns[activeColIndex].items[activeTaskIndex];
        console.log({ columns });
        await axios
            .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`, { task: columns[activeColIndex].items[activeTaskIndex] })
        let newColumnId;
        if (oldEmpList.length !== 0) {
            newColumnId = Object.keys(columns).find(columnId =>
                columns[columnId].name === "ASSIGNED"
            );
            setActiveColIndex(newColumnId)
            // newCol = updateTaskStatus(columns[activeColIndex].items[activeTaskIndex]._id, "ASSIGNED", true)
        } else {
            newColumnId = Object.keys(columns).find(columnId =>
                columns[columnId].name === "ASSIGNED"
            );
            console.log({ newColumnId });
            setActiveColIndex(newColumnId)
            // newCol = updateTaskStatus(columns[activeColIndex].items[activeTaskIndex]._id, "PENDING", true)
        }

        console.log("Gursewak1", { newCol, taskId, newColumnId, taskIndex });
        let taskId = oldCol[activeColIndex].items[activeTaskIndex]._id;
        let taskIndex = newCol[newColumnId].items.findIndex(item => item._id === taskId);
        console.log("Gursewak2", { newCol, taskId, newColumnId, taskIndex });
        setActiveColIndex(newColumnId);
        setActiveTaskIndex(taskIndex);
    }

    const updateTaskStatus = async (taskId, newStatus) => {
        const updatedColumns = { ...columns };
        const oldColumnId = Object.keys(columns).find(columnId =>
            columns[columnId].items.some(item => item._id === taskId)
        );
        const newColumnId = Object.keys(columns).find(columnId =>
            columns[columnId].name === newStatus
        );
        console.log({ oldColumnId, newStatus, columns, newColumnId });
        const taskIndex = columns[oldColumnId].items.findIndex(item => item._id === taskId);

        let oldItemsFromBackend = itemsFromBackend;
        let itemsFromBackendIndex = itemsFromBackend.findIndex(item => item._id === taskId);
        oldItemsFromBackend[itemsFromBackendIndex].status = newStatus;

        var task = columns[oldColumnId].items[taskIndex];
        task.status = newStatus;

        await axios
            .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`, { task })
        setState({
            ...state,
            list: oldItemsFromBackend
        })
        setItemsFromBackend(oldItemsFromBackend);
        setSelectedTask(oldItemsFromBackend[itemsFromBackendIndex])
        updatedColumns[oldColumnId].items.splice(taskIndex, 1);
        updatedColumns[newColumnId].items.push(oldItemsFromBackend[itemsFromBackendIndex]);
        setColumns(updatedColumns);
        return updatedColumns;
    };


    const [currentEmpList, setCurrentEmpList] = useState([])

    return (
        <div className="flex task-board h-full">
            <DragDropContext onDragEnd={handleDragEnd}>
                {Object.entries(columns).map(([columnId, column], colIndex) => {
                    if (colIndex == 0 && !state.teamDetail?.team_leader_ids?.some(item => item.user_id._id === state.userId)) return;
                    return (<div key={columnId} className="flex flex-col items-center">
                        <h2>{column.name}</h2>
                        {/* Hide For Now */}
                        {/* <button onClick={() => handleRemoveColumn(columnId)}>Remove Column</button> */}
                        <div className="mt-8">
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`p-4 w-64 min-h-64 ${snapshot.isDraggingOver ? 'bg-lightblue' : 'bg-lightgrey'
                                            }`}
                                    >
                                        {column.items.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`Item p-4 mb-2 min-h-12 ${snapshot.isDragging ? 'drag' : 'not-drag'
                                                            } text-white`}
                                                        onClick={() => openTaskPopup(columnId, index/* itemIndex */, item._id)}
                                                    >
                                                        {item.task_name}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>)
                })}
                {/* Hide column add feature for Now */}
                {/* <div className="mt-8">
                    <input
                        type="text"
                        placeholder="Enter column name"
                        value={newColumnName}
                        onChange={e => setNewColumnName(e.target.value)}
                        className="mr-2 p-2"
                    />
                    <button onClick={handleAddColumn} className="p-2 bg-blue-500 text-white">
                        Add Column
                    </button>
                </div> */}
            </DragDropContext>
            {selectedTask && <>

                <div className="single-task-popup bg-white p-4 rounded shadow">
                    <div className="top">
                        <div className="task-status mt-4">
                            <select value={selectedTask.status} name="task_status" id="" onChange={async (e) => {
                                let newStatus = e.target.value;
                                updateTaskStatus(selectedTask._id, newStatus);
                                // let oldTasks = [...state.list]
                                // oldTasks[index] = task;
                                // await axios
                                //     .patch(process.env.REACT_APP_NODE_URL + `/tasks/updateTask/`, { task })
                                // setState({
                                //     ...state,
                                //     list: oldTasks
                                // })
                            }}>
                                <option value="PENDING">Pending</option>
                                <option value="ASSIGNED">Assigned</option>
                                <option value="IN_PROCESS">In-Processing</option>
                                <option value="SUBMITTED">Submitted</option>
                                <option value="TESTING">Testing</option>
                                <option value="FAILED">FAILED</option>
                                <option value="COMPLETE">Complete</option>
                            </select>
                            {/* Employees */}
                            {
                                selectedTask?.team_leader_ids?.some(item => item.user_id._id === state.userId) ?
                                    <ButtonPrimary onclick={() => {
                                        setModal(true)
                                    }} title={`(${selectedTask?.employee_ids?.length || 0}) Manage`} /> :
                                    "Employees " + selectedTask?.employee_ids?.length || 0
                            }
                            {/* <h4 className="mb-2">Update Status:</h4>
                        <button
                            onClick={() => updateTaskStatus(task.id, 'Requested')}
                            className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                        >
                            Move to Requested
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task.id, 'To do')}
                            className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                        >
                            Move to To do
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                        >
                            Move to In Progress
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task.id, 'Done')}
                            className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                        >
                            Move to Done
                        </button> */}
                        </div>
                        {/* Close button */}
                        <button
                            onClick={closeTaskPopup}
                            className="px-4 py-2 bg-gray-500 text-white rounded mt-4"
                        >
                            Closes
                        </button>
                    </div>
                    <div className="bottom">
                        <div className="left">
                            <h3>{selectedTask.task_name}</h3>
                            <p>{selectedTask.task_description}</p>
                            {/* Additional features */}
                            {/* <div className="task-files mt-4">
                                <h4 className="mb-2">Attached Files:</h4>
                                <div className="list">
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>
                                    <div className="single-file">
                                        <img src="" alt="" className='imageContent' />
                                    </div>
                                    <div className="single-file">
                                        <div className="otherContent"></div>
                                    </div>

                                </div>
                            </div> */}
                        </div>
                        <div className="right">
                            <div className="task-stream mt-4">
                                <TaskStream columns={columns} itemsFromBackend={itemsFromBackend} state={state} setState={setState} activeTaskIndex={activeTaskIndex} activeColIndex={activeColIndex} />
                                {/* <ChatStream /> */}
                            </div>
                        </div>
                    </div>

                </div>
            </>}

            {Modal && (
                <div className={`${Modal ? "modal_cover filter_model" : "modal_cover filter_model hidden"}`}>
                    <div className="modal_inner select-col-popup">
                        <div className="header_modal">
                            <h1>Team Employees List : </h1>
                            <br />
                            <ul>
                                {
                                    // make checkboxes with labels for state?.teamDetail.employee_ids
                                    state?.teamDetail?.employee_ids?.map((teamEmp, empIndex) => {
                                        console.log({ activeColIndex, activeTaskIndex, columns });
                                        return (
                                            <li key={empIndex}>
                                                {/* {state.list[activeTaskIndex].task_name} */}
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={currentEmpList?.some(item => item.user_id._id === teamEmp.user_id._id)}
                                                    onChange={async () => {
                                                        console.log({ activeColIndex, activeTaskIndex, columns });
                                                        let oldEmpList = [...currentEmpList];
                                                        if (oldEmpList.some(item => item.user_id._id == teamEmp.user_id._id)) {
                                                            oldEmpList = oldEmpList.filter(emp => emp.user_id._id !== teamEmp.user_id._id);
                                                        } else {
                                                            oldEmpList.push(teamEmp);
                                                        }
                                                        setCurrentEmpList([...oldEmpList]);

                                                        // setState({
                                                        //     ...state,
                                                        //     list: columns[activeColIndex].items[activeTaskIndex]
                                                        // })

                                                    }}
                                                />
                                                <label
                                                    htmlFor={teamEmp.user_id.email}
                                                    className="ml-2"
                                                >
                                                    {teamEmp.user_id.email}
                                                </label>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            <div className="my-2 w-full flex justify-end">
                                <ButtonPrimary theme="green" title="Save" onclick={() => {
                                    setModal(false)
                                    finalUpdateEmpList(activeColIndex, activeTaskIndex);
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


};

export default TaskBoard;




// const ChatStream = () => {
//     const [messages, setMessages] = useState([
//         { content: 'Hello!', type: 'text', sender: 'user' },
//         { content: 'How are you?', type: 'text', sender: 'other' },
//         {
//             content: {
//                 name: 'image.jpg',
//                 url: 'https://example.com/image.jpg',
//             },
//             type: 'image',
//             sender: 'user',
//         },
//     ]);
//     const [inputText, setInputText] = useState('');

//     const handleInputChange = (event) => {
//         setInputText(event.target.value);
//     };

//     const handleSendMessage = () => {
//         if (inputText.trim() !== '') {
//             const newMessage = {
//                 content: inputText,
//                 type: 'text',
//                 sender: 'user',
//             };
//             setMessages([...messages, newMessage]);
//             setInputText('');
//         }
//     };

//     const handleSendImage = () => {
//         const newMessage = {
//             content: {
//                 name: 'image.jpg',
//                 url: 'https://example.com/image.jpg',
//             },
//             type: 'image',
//             sender: 'user',
//         };
//         setMessages([...messages, newMessage]);
//     };

//     return (
//         <div className="chat-stream">
//             <div className="messages">
//                 {messages.map((message, index) => (
//                     <div
//                         className={`message ${message.sender === 'user' ? 'user' : 'other'}`}
//                         key={index}
//                     >
//                         {message.type === 'text' && <p>{message.content}</p>}
//                         {message.type === 'image' && (
//                             <img src={message.content.url} alt={message.content.name} />
//                         )}
//                     </div>
//                 ))}
//             </div>
//             <div className="input-section">
//                 <input
//                     type="text"
//                     value={inputText}
//                     onChange={handleInputChange}
//                     placeholder="Type a message..."
//                 />
//                 <button onClick={handleSendMessage}>Send</button>
//                 <button onClick={handleSendImage}>Send Image</button>
//             </div>
//         </div>
//     );
// };

const TaskStream = ({ columns, itemsFromBackend /*don't use this*/, state, setState, activeTaskIndex, activeColIndex }) => {
    const [History, setHistory] = useState({});
    const [HistoryWait, setHistoryWait] = useState(true);

    useEffect(async () => {
        let result = await getHistory();
        if (result) {
            setHistoryWait(false)
        }
    }, [])


    const getHistory = async () => {
        setHistoryWait(true)
        let response = await axios.post(
            process.env.REACT_APP_NODE_URL + "/tasks/getData",
            { taskId: columns[activeColIndex].items[activeTaskIndex]._id }
        )

        console.log({
            data: response.data.details.data,
            baseUrl: response.data.details.baseUrl,
        });
        setHistory({
            data: response.data.details.data,
            baseUrl: response.data.details.baseUrl,
        })
        return true;

    }

    const [messages, setMessages] = useState([
        { content: 'Hello!', type: 'file', sender: 'user' },
        { content: 'Hello!', type: 'file', sender: 'user' },
        { content: 'Hello!', type: 'file', sender: 'user' },
        { content: 'Hello!', type: 'file', sender: 'user' },
    ]);
    const [inputFiles, setInputFiles] = useState(null);

    const handleInputChange = (event) => {
        setInputFiles(event.target.files);
    };

    const handleSendMessage = () => {
        console.log({ inputFiles });
        // if (inputText.trim() !== '') {
        //     const newMessage = {
        //         content: inputText,
        //         type: 'text',
        //         sender: 'user',
        //     };
        //     setMessages([...messages, newMessage]);
        //     setInputText('');    
        // }
    };


    const [submitType, setSubmitType] = useState("FILES")
    const [files, setFiles] = useState(null)

    const handleFiles = (e) => {
        setFiles(e.target.files)
    };


    return (
        <div className="chat-stream">
            <div className="messages">

                {
                    HistoryWait ? "Loading..." :
                        History?.data && History.data.map(history => {
                            return (
                                <div key={history._id}>
                                    {history.submit_type == "LINKS" && <>
                                        {
                                            history.submit_data.map(myLink => {
                                                return (
                                                    <div>
                                                        <a className="p-2 border-[darkgrey] rounded hover:bg-[grey] border-2 my-2 block" href={myLink} target="_blank" rel="noopener noreferrer"><b className="font-black">Link: </b>{myLink}
                                                            <br />
                                                            <div className="flex justify-end">
                                                                <span>{history?.parent_id?.email}</span> &nbsp;||&nbsp;
                                                                <span>{new Date(history.createdAt).toLocaleString()}</span>
                                                            </div>
                                                        </a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>}

                                    {history.submit_type == "FILES" && <>
                                        {
                                            history.submit_data.map(myLink => {
                                                return (
                                                    <div>
                                                        <a className="p-2 border-[darkgrey] rounded hover:bg-[grey] border-2 my-2 block" href={History.baseUrl + myLink} target="_blank" rel="noopener noreferrer"><b className="font-black">File: </b>{History.baseUrl + myLink}
                                                            <br />
                                                            <div className="flex justify-end">
                                                                <span>{history?.parent_id?.email}</span> &nbsp;||&nbsp;
                                                                <span>{new Date(history.createdAt).toLocaleString()}</span>
                                                            </div>
                                                        </a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>}
                                </div>
                            )
                        })
                }
            </div>
            <div className="input-section">

                <div className="header_modal w-full">
                    <select name="submit-type" id="" value={submitType}
                        onChange={(e) => {
                            setSubmitType(e.target.value)
                        }}
                    >
                        <option value="FILES">Files</option>
                        <option value="LINKS">Links/Urls</option>
                    </select>

                    <div className="flexbox">
                        <div className='w-10/12'>
                            {
                                submitType === "FILES" &&
                                <div>
                                    <input multiple onChange={handleFiles} className="my-2 rounded border-2 border-grey px-4 py-2" type="file" name="" id="" />
                                    <div>
                                        <p><b>Note: Upload Zip or Pdf Files</b></p>
                                    </div>
                                </div>
                            }
                            {
                                submitType === "LINKS" &&
                                <div>
                                    <input onChange={(e) => {
                                        setState({
                                            ...state,
                                            submit_data: e.target.value
                                        })
                                    }} placeholder="http://link1.com/;http://link2.com" className="my-2 rounded border-2 border-grey px-4 py-2" type="text" id="data" />
                                    <div>
                                        <p><b>Note: Write multiple links with semicolon separated</b></p>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="w-2/12 flex justify-end">
                            <ButtonPrimary title="Submit" onclick={async () => {
                                const fd = new FormData();
                                if (submitType == "FILES") {
                                    for (let index = 0; index < files.length; index++) {
                                        const file = files[index];
                                        fd.append("files", file)
                                    }
                                    fd.append("submit_data", "");
                                } else {
                                    console.log(state.submit_data)
                                    fd.append("submit_data", state.submit_data);
                                }
                                fd.append("taskId", state.list[activeTaskIndex]._id);
                                fd.append("submit_type", submitType);

                                setState({
                                    ...state,
                                    submitProcessing: true,
                                });
                                var config = { headers: { Authorization: `Bearer ${getToken("admin")}` } };
                                let response = await axios.post(
                                    process.env.REACT_APP_NODE_URL + "/tasks/uploadData",
                                    fd,
                                    config
                                );

                                let result = await getHistory();
                                if (result) {
                                    setHistoryWait(false)
                                }
                            }} />
                        </div>
                    </div>
                </div>
                {/* <input
                    type="file"
                    onChange={handleInputChange}
                    multiple={true}
                />
                <button onClick={handleSendMessage}>Upload</button> */}
            </div>
        </div>
    );
};

