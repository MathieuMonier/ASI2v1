import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {API_BASE_URL} from "../config";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Login failed");
      const userId = await res.json();
      const userRes = await fetch(`${API_BASE_URL}/user/${userId}`);
      const userData = await userRes.json();
      login(userData); 
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border p-2 w-full rounded" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 w-full rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
      {error && <p className="mt-3 text-center text-red-600">{error}</p>}
    </div>
  );
}
