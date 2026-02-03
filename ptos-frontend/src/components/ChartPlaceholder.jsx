import React from "react";

const ChartPlaceholder = ({ title }) => {
  return (
    <div className="chart-placeholder">
      <h3>{title}</h3>
      <p className="empty-state">Chart will appear here</p>
    </div>
  );
};

export default ChartPlaceholder;
