import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";





const Sidebar = () => {

    const { logout, user } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">✦ MemoryMesh</div>
            <nav>
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/memories">Memories</NavLink>
                <NavLink to="/settings">Settings</NavLink>
            </nav>
            <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{user?.email}</div>
                <button className="logout" onClick={logout}>Log out</button>
            </div>
        </aside>
    );

};






export default Sidebar;
