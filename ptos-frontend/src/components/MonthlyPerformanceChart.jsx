import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const formatData = (data) => {
  return data.map((d) => ({
    month: `${d._id.month}/${d._id.year}`,
    pnl: d.totalPnL,
  }));
};

const MonthlyPerformanceChart = ({ data }) => {
  const formatted = formatData(data);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={formatted}>
        <XAxis dataKey="month" />
        <YAxis />

        <Tooltip
          formatter={(value) => [`$${value}`, "PnL"]}
        />

        <Bar dataKey="pnl">
          {formatted.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.pnl >= 0 ? "#4caf50" : "#f44336"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPerformanceChart;