import React from "react";
import "./StrategyPerformanceChart.css";

const StrategyPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="empty-state">No strategy data</p>;
  }

  return (
    <div className="strategy-list">
      {data.map((strategy, index) => (
        <div key={index} className="strategy-card">
          <div className="strategy-header">
            <span className="rank">#{index + 1}</span>
            <span className="name">{strategy.strategy}</span>
          </div>

          <div className="strategy-stats">
            <div>
              <label>PnL</label>
              <p
                className={
                  strategy.totalPnL >= 0 ? "green" : "red"
                }
              >
                ${strategy.totalPnL}
              </p>
            </div>

            <div>
              <label>Win Rate</label>
              <p>{strategy.winRate}%</p>
            </div>

            <div>
              <label>Trades</label>
              <p>{strategy.tradeCount}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(strategy.winRate, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StrategyPerformanceChart;