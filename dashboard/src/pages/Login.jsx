import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// /login

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);






    const handleSubmit = async (event) => {

        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setIsSubmitting(false);
        }

    };



    return (
        <div className="auth-page">
            <div className="auth-box card">
                <h1>✦ MemoryMesh</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-text">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="primary" type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: 14, fontSize: 13 }}>
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );

};






export default Login;
