import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DrawdownChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="date" hide />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="drawdown"
          stroke="#ff4d4f"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DrawdownChart;