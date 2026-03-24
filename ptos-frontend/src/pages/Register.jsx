import React, { useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const validatePassword = (password) => {
    if (password.length < 8) return "Weak";
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password)
    )
      return "Strong";
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔐 VALIDATION
    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError("Invalid email format");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      login(data.token);
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="subtitle">Start tracking your trades like a pro</p>

        {error && <div className="error-box">{error}</div>}

        <label>Name</label>
        <input
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        {/* 🔥 Password Strength */}
        {form.password && (
          <p className={`strength ${passwordStrength.toLowerCase()}`}>
            Strength: {passwordStrength}
          </p>
        )}

        <button className="btn-primary">Create Account</button>
      </form>
    </div>
  );
};

export default Register;