import React, { useState, useContext } from "react";
import { API_BASE_URL, NOTIFICATION_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useBroadcast } from "../hooks/useBroadcast";
import { NotificationCenter } from "../components/NotificationsCenter";

export default function Create() {
    const { user } = useContext(AuthContext);
    const [imagePrompt, setImagePrompt] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Connexion au WebSocket via proxy Nginx
    const { connected, messages, clear } = useBroadcast(`${NOTIFICATION_BASE_URL}/ws`);

    // Retire le 1er message affiché
    const consume = () => { messages.shift(); };

    const handleGenerate = async () => {
        if (!user) return alert("Please login first");
        if (!imagePrompt || !description) return alert("Please fill both fields");

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`${API_BASE_URL}/prompt`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_user: user.id,
                    imagePrompt,
                    description
                }),
            });

            if (!res.ok) throw new Error("Failed to create card");

            const data = await res.json();

            setMessage(`Card created with ID ${data.id}.`);
            setImagePrompt("");
            setDescription("");

        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNotify = async () => {
        try {
            const res = await fetch(`${NOTIFICATION_BASE_URL}/notify?msg=Bonjour`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ msg: "Bonjour" })
            });
            if (!res.ok) throw new Error("Erreur lors de la notification");
            setMessage("Notification envoyée avec succès !");
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 shadow rounded space-y-4">
            <h2 className="text-xl font-bold">Create a new card</h2>

            <input
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Image prompt"
                className="border p-2 w-full rounded"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border p-2 w-full rounded"
            />

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded w-full"
            >
                {loading ? "Creating..." : "Create"}
            </button>

            <button
                onClick={handleNotify}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                Envoyer "Bonjour"
            </button>

            <p>WebSocket: {connected ? "connecté" : "déconnecté"}</p>

            <NotificationCenter queue={messages} onConsume={consume} duration={10000} />
            {message && <p className="text-center mt-2">{message}</p>}
        </div>
    );
}
