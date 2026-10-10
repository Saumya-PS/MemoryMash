import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Memories from "./pages/Memories";
import MemoryDetails from "./pages/MemoryDetails";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

// Logged-in pages share the sidebar layout.

const PrivateLayout = ({ children }) => {

    return (
        <ProtectedRoute>
            <div className="layout">
                <Sidebar />
                <div className="main-content">{children}</div>
            </div>
        </ProtectedRoute>
    );

};





const App = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
            <Route path="/memories" element={<PrivateLayout><Memories /></PrivateLayout>} />
            <Route path="/memories/:id" element={<PrivateLayout><MemoryDetails /></PrivateLayout>} />
            <Route path="/settings" element={<PrivateLayout><Settings /></PrivateLayout>} />
        </Routes>
    );

};




export default App;
