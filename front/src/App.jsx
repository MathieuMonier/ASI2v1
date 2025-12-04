import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import AddUser from "./pages/AddUser";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Create from "./pages/Create";
import GamePage from "./pages/GamePage";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={logout} />
      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={user ? <Home user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/buy" element={user ? <Buy user={user} /> : <Navigate to="/login" />} />
          <Route path="/sell" element={user ? <Sell user={user} /> : <Navigate to="/login" />} />
          <Route path="/create" element={user ? <Create user={user} /> : <Navigate to="/login" />} />
          <Route path="/game" element={user ? <GamePage /> : <Navigate to="/login" />} /> 
        </Routes>
      </main>
    </div>
  );
}