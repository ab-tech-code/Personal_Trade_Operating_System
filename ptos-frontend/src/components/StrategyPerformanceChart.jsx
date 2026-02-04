import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StrategyPerformanceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="strategy" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="totalPnL" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StrategyPerformanceChart;
