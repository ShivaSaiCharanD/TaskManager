import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskData, setEditTaskData] = useState({});
    const [newTaskData, setNewTaskData] = useState({ task: '', status: '', date: '', priority: 5 });
    const [isAdding, setIsAdding] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'task', direction: 'ascending' });

    const getTasks = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/task/get', {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            setTasks(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const addTask = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/task/add', newTaskData, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            console.log(response);
            getTasks();
            setIsAdding(false);
            setNewTaskData({ task: '', status: '', date: '', priority: '' });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:4000/api/task/delete?_id=${taskId}`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            getTasks();
        } catch (err) {
            console.log(err);
        }
    }

    const updateTask = async (taskId, updatedTask) => {
        try {
            await axios.put(`http://localhost:4000/api/task/update`, { _id: taskId, ...updatedTask }, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            getTasks();
            setEditTaskId(null); // Exit edit mode after saving
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getTasks();
    }, []);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortTasks(key, direction);
    }

    const sortTasks = (key, direction) => {
        const sortedTasks = [...tasks].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setTasks(sortedTasks);
    }

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return '';
    }

    const handleEditClick = (task) => {
        setEditTaskId(task._id);
        setEditTaskData(task);
    }

    const handleInputChange = (e, key, isNewTask = false) => {
        if (isNewTask) {
            setNewTaskData({ ...newTaskData, [key]: e.target.value });
        } else {
            setEditTaskData({ ...editTaskData, [key]: e.target.value });
        }
    }

    const handleSaveClick = (taskId) => {
        updateTask(taskId, editTaskData);
    }

    const handleAddClick = () => {
        setIsAdding(true);
    }

    const handleAddSaveClick = () => {
        addTask();
    }

    return (
        <>
            <div>
                <h1 className='heading'>Tasks</h1>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('task')}>
                                Task {getSortIndicator('task')}
                            </th>
                            <th onClick={() => handleSort('status')}>
                                Status {getSortIndicator('status')}
                            </th>
                            <th onClick={() => handleSort('date')}>
                                Date {getSortIndicator('date')}
                            </th>
                            <th onClick={() => handleSort('priority')}>
                                Priority {getSortIndicator('priority')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task._id}>
                                <td>
                                    {editTaskId === task._id ? (
                                        <input
                                            type="text"
                                            value={editTaskData.task}
                                            onChange={(e) => handleInputChange(e, 'task')}
                                        />
                                    ) : (
                                        task.task
                                    )}
                                </td>
                                <td>
                                    {editTaskId === task._id ? (
                                        <input
                                            type="text"
                                            value={editTaskData.status}
                                            onChange={(e) => handleInputChange(e, 'status')}
                                        />
                                    ) : (
                                        task.status
                                    )}
                                </td>
                                <td>
                                    {editTaskId === task._id ? (
                                        <input
                                            type="text"
                                            value={editTaskData.date}
                                            onChange={(e) => handleInputChange(e, 'date')}
                                        />
                                    ) : (
                                        task.date
                                    )}
                                </td>
                                <td>
                                    {editTaskId === task._id ? (
                                        <input
                                            type="text"
                                            value={editTaskData.priority}
                                            onChange={(e) => handleInputChange(e, 'priority')}
                                        />
                                    ) : (
                                        task.priority
                                    )}
                                </td>
                                <td>
                                    {editTaskId === task._id ? (
                                        <button onClick={() => handleSaveClick(task._id)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(task)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                            </svg>
                                        </button>
                                    )}
                                    <button onClick={() => deleteTask(task._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {isAdding && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={newTaskData.task}
                                        onChange={(e) => handleInputChange(e, 'task', true)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newTaskData.status}
                                        onChange={(e) => handleInputChange(e, 'status', true)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newTaskData.date}
                                        onChange={(e) => handleInputChange(e, 'date', true)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newTaskData.priority}
                                        onChange={(e) => handleInputChange(e, 'priority', true)}
                                    />
                                </td>
                                <td>
                                    <button onClick={handleAddSaveClick}>Save</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!isAdding && (
                <button onClick={handleAddClick} className='addbutton'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                    </svg>
                </button>
            )}
        </>
    )
}
