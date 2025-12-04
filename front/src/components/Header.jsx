import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Header({ user, onLogout }) {
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/user/${user.id}`)
        .then(res => res.json())
        .then(data => setWallet(data.account))
        .catch(console.error);
    }
  }, [user]);

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <nav className="space-x-3">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/add-user" className="hover:underline">Add user</Link>
        </nav>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span><strong>{user.login}</strong> - ${typeof wallet === "number" ? wallet.toFixed(2) : "0.00"}</span>
            <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </header>
  );
}
