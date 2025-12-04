import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function AddUser() {
  const [form, setForm] = useState({ login: "", pwd: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("User creation failed");
      const user = await res.json();
      setMessage(`User ${user.login} created with ID ${user.id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="login" value={form.login} onChange={handleChange} placeholder="Login" className="border p-2 w-full rounded" />
        <input name="pwd" type="password" value={form.pwd} onChange={handleChange} placeholder="Password" className="border p-2 w-full rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Create</button>
      </form>
      {message && <p className="mt-3 text-center text-blue-600">{message}</p>}
    </div>
  );
}
