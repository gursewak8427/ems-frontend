import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
const { v4: uuid } = require('uuid');

const itemsFromBackend = [
    { id: uuid(), content: 'First task', description: 'Task description 1', status: 'Requested' },
    { id: uuid(), content: 'Second task', description: 'Task description 2', status: 'To do' },
    { id: uuid(), content: 'Third task', description: 'Task description 3', status: 'In Progress' },
    { id: uuid(), content: 'Fourth task', description: 'Task description 4', status: 'Done' },
    { id: uuid(), content: 'Fifth task', description: 'Task description 5', status: 'Done' },
];

const initialColumns = {
    [uuid()]: {
        name: 'Pending',
        items: itemsFromBackend.filter(task => task.status === 'Pending'),
    },
    [uuid()]: {
        name: 'Assigned',
        items: itemsFromBackend.filter(task => task.status === 'Assigned'),
    },
    [uuid()]: {
        name: 'In-Processing',
        items: itemsFromBackend.filter(task => task.status === 'In-Processing'),
    },
    [uuid()]: {
        name: 'Submitted',
        items: itemsFromBackend.filter(task => task.status === 'Submitted'),
    },
    [uuid()]: {
        name: 'Testing',
        items: itemsFromBackend.filter(task => task.status === 'Testing'),
    },
    [uuid()]: {
        name: 'Failed',
        items: itemsFromBackend.filter(task => task.status === 'Failed'),
    },
    [uuid()]: {
        name: 'Complete',
        items: itemsFromBackend.filter(task => task.status === 'Complete'),
    },
};

const TaskBoard = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newColumnName, setNewColumnName] = useState('');

    const handleDragEnd = result => {
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

    const openTaskPopup = taskId => {
        const task = Object.values(columns)
            .flatMap(column => column.items)
            .find(item => item.id === taskId);
        setSelectedTask(task);
    };

    const closeTaskPopup = () => {
        setSelectedTask(null);
    };

    const updateTaskStatus = (taskId, newStatus) => {
        const updatedColumns = { ...columns };
        const oldColumnId = Object.keys(columns).find(columnId =>
            columns[columnId].items.some(item => item.id === taskId)
        );
        const newColumnId = Object.keys(columns).find(columnId =>
            columns[columnId].name === newStatus
        );
        const taskIndex = columns[oldColumnId].items.findIndex(item => item.id === taskId);
        const task = updatedColumns[oldColumnId].items.splice(taskIndex, 1)[0];
        updatedColumns[newColumnId].items.push(task);
        setColumns(updatedColumns);
    };

    return (
        <div className="flex task-board justify-center h-full">
            <DragDropContext onDragEnd={handleDragEnd}>
                {Object.entries(columns).map(([columnId, column], index) => (
                    <div key={columnId} className="flex flex-col items-center">
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
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-4 mb-2 min-h-12 ${snapshot.isDragging ? 'bg-blue-600' : 'bg-blue-400'
                                                            } text-white`}
                                                        onClick={() => openTaskPopup(item.id)}
                                                    >
                                                        {item.content}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                ))}
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
            {selectedTask && <TaskPopup task={selectedTask} updateTaskStatus={updateTaskStatus} closeTaskPopup={closeTaskPopup} />}
        </div>
    );
};

export default TaskBoard;


const TaskPopup = ({ task, updateTaskStatus, closeTaskPopup }) => {
    return (
        <div className="single-task-popup bg-white p-4 rounded shadow">
            <div className="top">
                <div className="task-status mt-4">
                    <h4 className="mb-2">Update Status:</h4>
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
                    </button>
                </div>
                {/* Close button */}
                <button
                    onClick={closeTaskPopup}
                    className="px-4 py-2 bg-gray-500 text-white rounded mt-4"
                >
                    Close
                </button>
            </div>
            <div className="bottom">
                <div className="left">
                    <h3>{task.content}</h3>
                    <p>{task.description}</p>
                    {/* Additional features */}
                    <div className="task-files mt-4">
                        <h4 className="mb-2">Attached Files:</h4>
                        <div className="list">
                            {/* Render attached files */}
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
                    </div>
                </div>
                <div className="right">
                    <div className="task-stream mt-4">
                        <TaskStream />
                        {/* <ChatStream /> */}
                    </div>
                </div>
            </div>

        </div>
    );
};


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

const TaskStream = () => {
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

    return (
        <div className="chat-stream">
            <div className="messages">
                {messages.map((message, index) => (
                    <></>
                    // <div
                    //     className={`message ${message.sender === 'user' ? 'user' : 'other'}`}
                    //     key={index}
                    // >
                    //     {message.type === 'text' && <p>{message.content}</p>}
                    //     {message.type === 'image' && (
                    //         <img src={message.content.url} alt={message.content.name} />
                    //     )}
                    // </div>
                ))}
            </div>
            <div className="input-section">
                <input
                    type="file"
                    onChange={handleInputChange}
                    multiple={true}
                />
                <button onClick={handleSendMessage}>Upload</button>
            </div>
        </div>
    );
};

