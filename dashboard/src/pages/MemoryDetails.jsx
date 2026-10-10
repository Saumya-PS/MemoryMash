import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

// /memories/:id - view, edit and delete one memory.

const MemoryDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [memory, setMemory] = useState(null);
    const [notes, setNotes] = useState("");
    const [userIntent, setUserIntent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [collections, setCollections] = useState([]);
    const [collectionId, setCollectionId] = useState("");






    const loadMemory = async () => {

        const response = await api.get(`/memories/${id}`);

        setMemory(response.data.data);
        setNotes(response.data.data.notes || "");
        setUserIntent(response.data.data.userIntent || "");
        setCollectionId(response.data.data.collection || "");

    };






    // Collections API arrives in a later commit, so fail quietly for now.

    const loadCollections = async () => {

        try {
            const response = await api.get("/collections");
            setCollections(response.data.data);
        } catch (error) {
            setCollections([]);
        }

    };




    useEffect(() => {

        loadMemory();
        loadCollections();

    }, [id]);





    const handleSave = async () => {

        const response = await api.put(`/memories/${id}`, {
            notes,
            userIntent,
            collection: collectionId || null
        });

        setMemory(response.data.data);
        setIsEditing(false);

    };






    const handleDelete = async () => {

        if (!window.confirm("Delete this memory permanently?")) {
            return;
        }

        await api.delete(`/memories/${id}`);
        navigate("/memories");

    };






    if (!memory) {
        return <p className="empty-state">Loading...</p>;
    }

    return (
        <div>
            <h1 className="page-title">{memory.title}</h1>

            <p style={{ marginBottom: 4 }}>
                <a href={memory.url} target="_blank" rel="noreferrer">{memory.url}</a>
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 18 }}>
                {memory.domain}
            </p>

            <div className="card" style={{ marginBottom: 16 }}>
                <h3>AI Summary</h3>
                <p>{memory.summary || "No summary generated."}</p>

                <h3 style={{ marginTop: 14 }}>Key Points</h3>
                <ul>
                    {(memory.keyPoints || []).map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>

                <div className="tag-row">
                    {(memory.topics || []).map((topic) => (
                        <span className="tag" key={topic}>{topic}</span>
                    ))}
                    {(memory.tags || []).map((tag) => (
                        <span className="tag" key={tag}>#{tag}</span>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3>Why I saved this / My Notes</h3>

                {isEditing ? (
                    <>
                        <textarea rows={2} value={userIntent} onChange={(e) => setUserIntent(e.target.value)} />
                        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />

                        <label>Collection</label>
                        <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                            <option value="">No collection</option>
                            {collections.map((collection) => (
                                <option key={collection._id} value={collection._id}>{collection.name}</option>
                            ))}
                        </select>

                        <button className="primary" onClick={handleSave}>Save</button>{" "}
                        <button className="secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <p><strong>Why:</strong> {memory.userIntent || "-"}</p>
                        <p><strong>Notes:</strong> {memory.notes || "-"}</p>
                        <button className="secondary" onClick={() => setIsEditing(true)}>Edit</button>{" "}
                        <button className="secondary" onClick={handleDelete}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );

};



export default MemoryDetails;
