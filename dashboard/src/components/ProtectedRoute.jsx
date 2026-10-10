import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Redirects to /login when nobody is signed in.

const ProtectedRoute = ({ children }) => {

    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="empty-state">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;

};



export default ProtectedRoute;
