import React from "react";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WinLossChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WinLossChart;
