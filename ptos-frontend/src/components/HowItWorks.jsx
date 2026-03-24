import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <h1>
          Track Your Trades Like a <span>Pro</span>
        </h1>
        <p>
          PTOS helps you analyze performance, connect exchanges,
          and improve your trading strategy with powerful insights.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why PTOS?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📊 Advanced Analytics</h3>
            <p>
              Track PnL, equity curve, streaks, and performance
              like institutional traders.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔗 Exchange Integration</h3>
            <p>
              Connect Binance, Bybit and more. Sync your trades
              automatically.
            </p>
          </div>

          <div className="feature-card">
            <h3>🧠 Smart Insights</h3>
            <p>
              Understand your strategy performance and improve
              your trading decisions.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Create your account</p>
          </div>

          <div className="step">
            <span>2</span>
            <p>Connect your exchange</p>
          </div>

          <div className="step">
            <span>3</span>
            <p>Track & improve your trades</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start Improving Your Trading Today</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/register")}
        >
          Create Free Account
        </button>
      </section>
    </div>
  );
};

export default Landing;