import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaUser, FaLock } from "react-icons/fa";
import "./loginform.css";

const Loginform = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const res = await axios.post("http://localhost:5010/api/auth/login", {
                username,
                password
            });
    
            const token = res.data.token;
            localStorage.setItem("token", token);
    
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded); 
            localStorage.setItem("role", decoded.role);
    
            if (decoded.role && decoded.role.toLowerCase() === "admin") {
                console.log("Redirecting to /admin"); 
                navigate("/admin");
            } else {
                console.log("Redirecting to /tasks"); 
                navigate("/tasks");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };
    
    

    return (
        <div className="login-page">
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>

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

                <button type="submit">Login</button>

                <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register</Link></p> {}
                </div>
            </form>
        </div>
        </div>
    );
};

export default Loginform;
