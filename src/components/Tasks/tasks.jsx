import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./tasks.css"; 

const TasksDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [editTaskModal, setEditTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeAllModals();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const closeAllModals = () => {
        setEditTaskModal(false);
        setAddTaskModal(false);
        setConfirmDeleteModal(false);
    };

    const fetchTasks = () => {
        axios.get("http://localhost:5010/api/tasks", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            params: { status: filterStatus, userTasksOnly: true, page: 1, limit: 100 }
        })
        .then(response => setTasks(response.data.items || []))
        .catch(error => console.error("Error fetching tasks:", error));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const openDeleteModal = (taskId) => {
        setTaskToDelete(taskId);
        setConfirmDeleteModal(true);
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await axios.delete(`http://localhost:5010/api/tasks/${taskToDelete}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            closeAllModals();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const openEditModal = (task) => {
        setTaskToEdit({ ...task });
        setEditTaskModal(true);
    };

    const handleEditTask = async () => {
        if (!taskToEdit || !taskToEdit.title.trim()) return;
        try {
            const updatedTask = { ...taskToEdit };
            await axios.put(`http://localhost:5010/api/tasks/${taskToEdit.id}`, updatedTask, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setTasks(tasks.map(t => (t.id === taskToEdit.id ? updatedTask : t)));
            closeAllModals();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const openAddTaskModal = () => {
        setNewTask({ title: "", description: "", status: "pending" });
        setAddTaskModal(true);
    };

    const handleAddTask = async () => {
        if (!newTask.title.trim()) return;
        try {
            const response = await axios.post("http://localhost:5010/api/tasks", newTask, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const addedTask = response.data;
            if (!addedTask.id) {
                console.error("Server did not return task ID.");
                return;
            }

            setTasks([...tasks, addedTask]);
            closeAllModals();
        } catch (error) {
            console.error("Error adding task:", error);
        }
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
                    <button className="add-task-btn" onClick={openAddTaskModal}>Add Task</button>
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
                            {tasks.length > 0 ? (
                                tasks.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.title}</td>
                                        <td>{task.description || "N/A"}</td>
                                        <td>{task.status}</td>
                                        <td>{task.created_at ? new Date(task.created_at).toLocaleString() : "N/A"}</td>
                                        <td className="action-cell">
                                            <FaEdit className="edit-icon" onClick={() => openEditModal(task)} /> 
                                            <FaTrash className="delete-icon" onClick={() => openDeleteModal(task.id)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5">No tasks found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {confirmDeleteModal && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Are you sure?</h2>
                        <p>Do you really want to delete this task? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={closeAllModals}>Cancel</button>
                            <button className="confirm-btn" onClick={handleDeleteTask}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {editTaskModal && taskToEdit && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Task</h2>
                        <input type="text" value={taskToEdit.title} onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })} placeholder="Title" />
                        <textarea value={taskToEdit.description} onChange={(e) => setTaskToEdit({ ...taskToEdit, description: e.target.value })} placeholder="Description" />
                        <select value={taskToEdit.status} onChange={(e) => setTaskToEdit({ ...taskToEdit, status: e.target.value })}>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={closeAllModals}>Cancel</button>
                            <button className="confirm-btn" onClick={handleEditTask}>Save</button>

                        </div>
                    </div>
                </div>
            )}
            {addTaskModal && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Task</h2>
                        <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Title" />
                        <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" />
                        <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={closeAllModals}>Cancel</button>
                            <button className="confirm-btn" onClick={handleAddTask}>Add</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TasksDashboard;
