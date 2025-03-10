import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./tasks.css";

const TasksDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);

    const fetchTasks = () => {
        axios.get("http://localhost:5010/api/tasks", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            params: { status: filterStatus, userTasksOnly: true } 
        })
        .then(response => {
            console.log("📢 User's tasks from API:", response.data);
            setTasks(response.data.items || []);
        })
        .catch(error => {
            console.error("🚨 Error fetching tasks:", error);
            setTasks([]);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="tasks-page">
            <div className="topbar">
                <Link to="/admin">Admin</Link>
                <Link to="/tasks">Tasks</Link>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="tasks-content">
                <h1>Tasks Dashboard</h1>
                <div className="filter-container">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="add-task-btn">Add Task</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.status}</td>
                                    <td>{task.createdAt ? new Date(task.createdAt).toLocaleString() : "N/A"}</td>
                                    <td className="action-cell">
                                        <FaEdit className="edit-icon" />
                                        <FaTrash className="delete-icon" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TasksDashboard;
