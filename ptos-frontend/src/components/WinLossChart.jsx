import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#4caf50", "#f44336"];

const WinLossChart = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div style={{ width: "100%", height: 250, position: "relative" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}   // 🔥 donut style
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [
              `${value} trades`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 🔥 CENTER TEXT */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          {total}
        </p>
        <small>Total</small>
      </div>
    </div>
  );
};

export default WinLossChart;