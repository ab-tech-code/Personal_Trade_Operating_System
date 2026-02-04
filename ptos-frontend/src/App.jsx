import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Trades from "./pages/Trades";
import AddTrade from "./pages/AddTrade";
import Analytics from "./pages/Analytics";
import Exchanges from "./pages/Exchanges";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/trades"
          element={
            <ProtectedRoute>
              <Trades />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/app/trades/new"
          element={
            <ProtectedRoute>
              <AddTrade />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/exchanges"
          element={
            <ProtectedRoute>
              <Exchanges />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
