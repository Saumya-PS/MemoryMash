import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// /settings - account info and delete account.

const Settings = () => {

    const { user, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDeleteAccount = async () => {

        setError("");
        setIsDeleting(true);

        try {
            await deleteAccount();
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete account");
            setIsDeleting(false);
        }

    };






    return (
        <div>
            <h1 className="page-title">Settings</h1>

            <div className="card">
                <h3>Account</h3>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
                <h3>About MemoryMesh</h3>
                <p style={{ color: "var(--text-muted)" }}>
                    MemoryMesh saves webpages with AI-generated summaries and connects them
                    to related pages you browse later through Memory Injection. Install the
                    browser extension to start saving pages.
                </p>
            </div>

            <div className="card danger-zone" style={{ marginTop: 16 }}>
                <h3>Delete account</h3>
                <p style={{ color: "var(--text-muted)" }}>
                    This permanently deletes your account and every memory saved with it. This cannot be undone.
                </p>

                {error && <p className="error-text">{error}</p>}

                {!isConfirming && (
                    <button className="danger" onClick={() => setIsConfirming(true)}>
                        Delete my account
                    </button>
                )}

                {isConfirming && (
                    <div>
                        <p><strong>Are you sure?</strong> All of your data will be gone for good.</p>
                        <button
                            className="danger"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            style={{ marginRight: 8 }}
                        >
                            {isDeleting ? "Deleting..." : "Yes, delete everything"}
                        </button>
                        <button className="secondary" onClick={() => setIsConfirming(false)}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

};





export default Settings;
