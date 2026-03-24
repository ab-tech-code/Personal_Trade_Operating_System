import React from "react";

const StatCard = ({ label, value, className }) => {
  return (
    <div className={`stat-card ${className || ""}`}>
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
};

export default StatCard;