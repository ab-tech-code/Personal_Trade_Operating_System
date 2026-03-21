import React from "react";
import "./TradeStreaks.css";

const TradeStreaks = ({ data }) => {
  if (!data) return null;

  return (
    <div className="streak-grid">
      <div className="streak-card">
        <h4>Current Win Streak</h4>
        <p className="green">{data.currentWinStreak}</p>
      </div>

      <div className="streak-card">
        <h4>Current Loss Streak</h4>
        <p className="red">{data.currentLossStreak}</p>
      </div>

      <div className="streak-card">
        <h4>Max Win Streak</h4>
        <p className="green">{data.maxWinStreak}</p>
      </div>

      <div className="streak-card">
        <h4>Max Loss Streak</h4>
        <p className="red">{data.maxLossStreak}</p>
      </div>
    </div>
  );
};

export default TradeStreaks;