import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./registerform.css";
import { FaUser, FaLock } from "react-icons/fa";

const Registerform = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await axios.post("http://localhost:5010/api/auth/register", {
                username,
                password,
            });

            setSuccess("Registered successfully! Please log in.");
            setTimeout(() => navigate("/login"), 1500); 
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-page">
            <div className="wrapper">
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
    
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        <span className="icon"><FaUser /></span>
                    </div>
    
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <span className="icon"><FaLock /></span>
                    </div>
    
                    {error && <p className="error-message message-box">{error}</p>}
                    {success && <p className="success-message message-box">{success}</p>}
    
                    <button type="submit">Register</button>
    
                    <div className="register-link">
                        <p>Have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );    
};

export default Registerform;
