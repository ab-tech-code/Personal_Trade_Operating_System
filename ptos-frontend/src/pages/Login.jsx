import React, { useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Added import

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure login from context
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      login(data.token); // Use context login instead of localStorage
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn">Login</button>
      </form>
    </section>
  );
};

export default Login;