import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

// /memories - list plus keyword/semantic search.

const Memories = () => {

    const [memories, setMemories] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);




    const loadAllMemories = async () => {

        setIsLoading(true);

        try {
            const response = await api.get("/memories");
            setMemories(response.data.data);
        } finally {
            setIsLoading(false);
        }

    };






    useEffect(() => {

        loadAllMemories();

    }, []);






    const handleSearch = async (event) => {

        event.preventDefault();

        if (!query.trim()) {
            loadAllMemories();
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.get("/search", { params: { q: query } });
            setMemories(response.data.data);
        } finally {
            setIsLoading(false);
        }

    };






    return (
        <div>
            <h1 className="page-title">Memories</h1>

            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Search by keyword or concept (e.g. backend authentication)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
                <button className="primary" type="submit">Search</button>
            </form>

            {isLoading && <p className="empty-state">Loading...</p>}

            {!isLoading && memories.length === 0 && (
                <p className="empty-state">No memories found.</p>
            )}

            <div className="grid">
                {memories.map((memory) => (
                    <Link to={`/memories/${memory._id}`} key={memory._id} className="memory-card">
                        <h3>{memory.title}</h3>
                        <p>{memory.summary || "No summary yet."}</p>
                        <div className="tag-row">
                            {(memory.tags || []).slice(0, 4).map((tag) => (
                                <span className="tag" key={tag}>{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

};




export default Memories;
