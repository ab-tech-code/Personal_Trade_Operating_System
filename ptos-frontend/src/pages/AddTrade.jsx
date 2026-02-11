import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { createTrade } from "../services/trades.service";

const AddTrade = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    symbol: "",
    side: "buy",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.symbol || !form.quantity || !form.entryPrice) {
      setError("Symbol, quantity, and entry price are required.");
      return;
    }

    setLoading(true);

    try {
      await createTrade({
        symbol: form.symbol.toUpperCase(),
        side: form.side.toLowerCase(),
        quantity: Number(form.quantity),
        entryPrice: Number(form.entryPrice),
        exitPrice: form.exitPrice ? Number(form.exitPrice) : undefined,
      });

      navigate("/app/trades");
    } catch (err) {
      setError(err.message || "Failed to create trade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container">
        <h1>Add Manual Trade</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <label>Symbol</label>
          <input
            name="symbol"
            placeholder="BTCUSDT"
            value={form.symbol}
            onChange={handleChange}
          />

          <label>Side</label>
          <select name="side" value={form.side} onChange={handleChange}>
            <option value="buy">Buy (Long)</option>
            <option value="sell">Sell (Short)</option>
          </select>

          <label>Quantity</label>
          <input
            name="quantity"
            type="number"
            step="any"
            value={form.quantity}
            onChange={handleChange}
          />

          <label>Entry Price</label>
          <input
            name="entryPrice"
            type="number"
            step="any"
            value={form.entryPrice}
            onChange={handleChange}
          />

          <label>Exit Price (optional)</label>
          <input
            name="exitPrice"
            type="number"
            step="any"
            value={form.exitPrice}
            onChange={handleChange}
          />

          <button className="btn" disabled={loading}>
            {loading ? "Saving..." : "Save Trade"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddTrade;
