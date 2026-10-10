import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

// Landing page: the most recent saved memories.

const Dashboard = () => {

    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);






    useEffect(() => {

        const loadRecentMemories = async () => {

            try {
                const response = await api.get("/memories");
                setMemories(response.data.data.slice(0, 6));
            } finally {
                setIsLoading(false);
            }

        };

        loadRecentMemories();

    }, []);






    return (
        <div>
            <h1 className="page-title">Dashboard</h1>

            <h2 style={{ fontSize: 16, margin: "20px 0 12px" }}>Recent memories</h2>

            {isLoading && <p className="empty-state">Loading...</p>}

            {!isLoading && memories.length === 0 && (
                <p className="empty-state">
                    No memories yet. Install the browser extension and save your first page.
                </p>
            )}

            <div className="grid">
                {memories.map((memory) => (
                    <Link to={`/memories/${memory._id}`} key={memory._id} className="memory-card">
                        <h3>{memory.title}</h3>
                        <p>{memory.summary || "No summary yet."}</p>
                        <div className="tag-row">
                            {(memory.tags || []).slice(0, 3).map((tag) => (
                                <span className="tag" key={tag}>{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

};




export default Dashboard;
