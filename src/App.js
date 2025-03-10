import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Loginform from "./components/Loginform/loginform.jsx";
import Registerform from "./components/Registerform/registerform";
import AdminDashboard from "./components/AdminDashboard/admin.jsx";
import TasksDashboard from "./components/Tasks/tasks.jsx"; // Проверь, что путь правильный

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Loginform />} />
        <Route path="/login" element={<Loginform />} />
        <Route path="/tasks" element={<TasksDashboard />} /> {/* Теперь правильно */}
        <Route path="/register" element={<Registerform />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
