import React from "react";

const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  );
};

export default StatCard;
