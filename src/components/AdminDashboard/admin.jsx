import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./admin.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:5010/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => setUsers(response.data))
        .catch(error => console.error("🚨 Error fetching users:", error));
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:5010/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
            setUsers(users.filter(user => user.id !== userId));
        })
        .catch(error => console.error("🚨 Error deleting user:", error));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>N/A</td> {/* ща надо будет сюда добавить */}
                                    <td className="action-cell">
                                            <FaTrash className="delete-icon" onClick={() => handleDeleteUser(user.id)} />
                                                
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

export default AdminDashboard;
