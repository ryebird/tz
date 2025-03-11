import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./admin.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState("users");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterUserId, setFilterUserId] = useState("");
    const [filterTaskId, setFilterTaskId] = useState("");

    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");

    const [taskPage, setTaskPage] = useState(1);
    const [taskLimit, setTaskLimit] = useState(10); 

    const [userRole, setUserRole] = useState(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true); 



    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState("");

    const [editTaskModal, setEditTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);




    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, []);

    const fetchUserRole = async () => {
        try {
            const response = await axios.get("http://localhost:5010/api/user", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setUserRole(response.data.role);
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };
    


    const closeAllModals = () => {
        setEditTaskModal(false);
        setTaskToEdit(null);
        setConfirmDeleteModal(false);
    };
    

    
    useEffect(() => {
        fetchUserRole();
    }, []);
    
    
    useEffect(() => {
        fetchTasks();
    }, [filterStatus, filterUserId, filterTaskId]);  


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeAllModals();
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    
    
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5010/api/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTasks = async () => {
        console.log("Fetching tasks with User ID:", filterUserId); 
    
        try {
            const response = await axios.get("http://localhost:5010/api/tasks", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                params: {
                    status: filterStatus || undefined,
                    userId: filterUserId || undefined, 
                    taskId: filterTaskId || undefined,
                    page: taskPage,
                    limit: taskLimit
                }
            });
    
            console.log("API Response:", response.data); 
    
            setTasks(response.data.items || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        }
    };
    
    


    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newOrder);

        const sortedUsers = [...users].sort((a, b) => {
            if (field === "id") {
                return newOrder === "asc" ? a.id - b.id : b.id - a.id;
            } else if (field === "username" || field === "role") {
                return newOrder === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
            } else if (field === "created_at") {
                return newOrder === "asc" ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });

        setUsers(sortedUsers);
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:5010/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
            setUsers(users.filter(user => user.id !== userId));
        })
        .catch(error => console.error("Error deleting user:", error));
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`http://localhost:5010/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
            setTasks(tasks.filter(task => task.id !== taskId));
        })
        .catch(error => console.error(" Error deleting task:", error));
    };

    const [taskSortField, setTaskSortField] = useState("id");
    const [taskSortOrder, setTaskSortOrder] = useState("asc");
    
    const handleTaskSort = (field) => {
        const newOrder = taskSortField === field && taskSortOrder === "asc" ? "desc" : "asc";
        setTaskSortField(field);
        setTaskSortOrder(newOrder);
    
        const sortedTasks = [...tasks].sort((a, b) => {
            if (field === "id" || field === "user_id") {
                return newOrder === "asc" 
                    ? Number(a[field]) - Number(b[field]) 
                    : Number(b[field]) - Number(a[field]);
            } else if (field === "title" || field === "status") {
                return newOrder === "asc" 
                    ? a[field].localeCompare(b[field]) 
                    : b[field].localeCompare(a[field]);
            } else if (field === "created_at") {
                return newOrder === "asc"
                    ? new Date(a[field]) - new Date(b[field])
                    : new Date(b[field]) - new Date(a[field]);
            }
            return 0;
        });
    
        setTasks(sortedTasks);
    };    

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
        const openDeleteModal = (id, type) => {
        setItemToDelete(id);
        setDeleteType(type);
        setConfirmDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (deleteType === "user") {
                await axios.delete(`http://localhost:5010/api/users/${itemToDelete}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setUsers(users.filter(user => user.id !== itemToDelete));
            } else if (deleteType === "task") {
                await axios.delete(`http://localhost:5010/api/tasks/${itemToDelete}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setTasks(tasks.filter(task => task.id !== itemToDelete));
            }
            setConfirmDeleteModal(false);
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const openEditTaskModal = (task) => {
        setTaskToEdit({ ...task });
        setEditTaskModal(true);
    };

    const handleEditTask = async () => {
        if (!taskToEdit) return;
        try {
            await axios.put(`http://localhost:5010/api/tasks/${taskToEdit.id}`, taskToEdit, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setTasks(tasks.map(t => (t.id === taskToEdit.id ? taskToEdit : t)));
            setEditTaskModal(false);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="admin-page">
            <div className="topbar">
                <Link to="/admin">Admin</Link>
                <Link to="/tasks">Tasks</Link>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="admin-content">
                <h1>Admin Dashboard</h1>

                <div className="admin-tabs">
                    <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
                    <button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>Tasks</button>
                </div>

                {activeTab === "users" && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort("id")}>ID {sortField === "id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                    <th onClick={() => handleSort("username")}>Username {sortField === "username" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                    <th onClick={() => handleSort("role")}>Role {sortField === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                    <th onClick={() => handleSort("created_at")}>Created At {sortField === "created_at" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role}</td>
                                            <td>{user.created_at ? new Date(user.created_at).toLocaleString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "N/A"}</td>
                                            <td className="action-cell">
                                             <FaTrash className="delete-icon" onClick={() => openDeleteModal(user.id, "user")} /> </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "tasks" && (
                    <>
                        <div className="filter-container">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <input type="text" placeholder="Filter by User ID" value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} />
                            <input type="text" placeholder="Search by Task ID" value={filterTaskId} onChange={(e) => setFilterTaskId(e.target.value)} />
                        </div>

                        <div className="table-container">
                            <table>
                            <thead>
                                 <tr>
                                    <th onClick={() => handleTaskSort("id")}> ID {taskSortField === "id" ? (taskSortOrder === "asc" ? "▲" : "▼") : ""} </th>
                                     <th onClick={() => handleTaskSort("title")}> Title {taskSortField === "title" ? (taskSortOrder === "asc" ? "▲" : "▼") : ""} </th>       
                                     <th onClick={() => handleTaskSort("status")}> Status {taskSortField === "status" ? (taskSortOrder === "asc" ? "▲" : "▼") : ""} </th>
                                     <th onClick={() => handleSort("id")}>User ID {sortField === "id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                     <th onClick={() => handleTaskSort("created_at")}> Created At {taskSortField === "created_at" ? (taskSortOrder === "asc" ? "▲" : "▼") : ""} </th>
                                     <th>Actions</th>
                                     </tr>
                                     </thead>

                                <tbody>
                                    {tasks.length > 0 ? (
                                        tasks.map(task => (
                                            <tr key={task.id}>
                                                <td>{task.id}</td>
                                                <td>{task.title}</td>
                                                <td>{task.status}</td>
                                                <td>{task.user_id || "N/A"}</td>
                                                <td>{task.created_at ? new Date(task.created_at).toLocaleString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "N/A"}</td>                                                <td className="action-cell">
                                                <FaEdit className="edit-icon" onClick={() => openEditTaskModal(task)} />
                                                <FaTrash className="delete-icon" onClick={() => openDeleteModal(task.id, "task")} />
                                                </td>
                                            </tr>
                                        ))
                                        
                                    ) : (
                                        <tr><td colSpan="6">No tasks found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

            </div>


            {confirmDeleteModal && (
                <div className="modal-overlay" onClick={() => setConfirmDeleteModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Are you sure?</h2>
                        <p>Do you really want to delete this {deleteType}? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setConfirmDeleteModal(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={handleDelete}>Delete</button>
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

        </div>
    );
};

export default AdminDashboard;