import React from "react";
import "./KPICards.css";

const KPICards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <h4>Total PnL</h4>
        <p className={summary.totalPnL >= 0 ? "green" : "red"}>
          ${summary.totalPnL}
        </p>
      </div>

      <div className="kpi-card">
        <h4>Win Rate</h4>
        <p>{summary.winRate}%</p>
      </div>

      <div className="kpi-card">
        <h4>Total Trades</h4>
        <p>{summary.totalTrades}</p>
      </div>

      <div className="kpi-card">
        <h4>Risk/Reward</h4>
        <p>{summary.riskReward || 0}</p>
      </div>

      <div className="kpi-card">
        <h4>Best Trade</h4>
        <p className="green">${summary.bestTrade}</p>
      </div>

      <div className="kpi-card">
        <h4>Worst Trade</h4>
        <p className="red">${summary.worstTrade}</p>
      </div>
    </div>
  );
};

export default KPICards;