import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { createTrade } from "../services/trades.service";

const AddTrade = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    symbol: "",
    side: "long",
    entryPrice: "",
    quantity: "",
    pnl: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.symbol || !form.entryPrice || !form.quantity) {
      setError("Symbol, entry price and quantity are required.");
      return;
    }

    setLoading(true);

    try {
      await createTrade({
        ...form,
        source: "manual",
      });

      navigate("/app/trades");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <h1>Add Trade</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Symbol</label>
        <input name="symbol" value={form.symbol} onChange={handleChange} />

        <label>Side</label>
        <select name="side" value={form.side} onChange={handleChange}>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>

        <label>Entry Price</label>
        <input
          name="entryPrice"
          type="number"
          value={form.entryPrice}
          onChange={handleChange}
        />

        <label>Quantity</label>
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />

        <label>PnL (optional)</label>
        <input name="pnl" type="number" value={form.pnl} onChange={handleChange} />

        <label>Notes (optional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Saving..." : "Save Trade"}
        </button>
      </form>
    </AppLayout>
  );
};

export default AddTrade;
