import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// /register

const Register = () => {

    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleSubmit = async (event) => {

        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await register(name, email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
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
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="primary" type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: 14, fontSize: 13 }}>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );

};






export default Register;
