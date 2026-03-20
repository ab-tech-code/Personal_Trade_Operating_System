import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Loading from "../components/Loading";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import StrategyPerformanceChart from "../components/StrategyPerformanceChart";
import WinLossChart from "../components/WinLossChart";
import EquityCurveChart from "../components/EquityCurveChart";

import KPICards from "../components/Analytics/KPICards";
import DrawdownChart from "../components/DrawdownChart";

import {
  fetchDashboardSummary,
  fetchMonthlyPerformance,
  fetchStrategyPerformance,
  fetchEquityCurve,
} from "../services/analytics.service";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [strategyPerformance, setStrategyPerformance] = useState([]);
  const [equityCurve, setEquityCurve] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryData, monthlyData, strategyData, equityData] =
          await Promise.all([
            fetchDashboardSummary(),
            fetchMonthlyPerformance(),
            fetchStrategyPerformance(),
            fetchEquityCurve(),
          ]);

        setSummary(summaryData);
        setMonthlyPerformance(monthlyData);
        setStrategyPerformance(strategyData);
        setEquityCurve(equityData); // ✅ THIS WAS MISSING
      } catch (err) {
        console.error("Analytics load failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppLayout>
      <h1>Analytics</h1>

      {loading && <Loading />}

      {!loading && (
        <>
          {/* 🔥 KPI CARDS */}
          <KPICards summary={summary} />

          <div className="analytics-grid">
            {/* Equity Curve */}
            <div className="chart-placeholder">
              <h3>Equity Curve</h3>
              {equityCurve.length === 0 ? (
                <p className="empty-state">No trades yet</p>
              ) : (
                <EquityCurveChart data={equityCurve} />
              )}
            </div>

            {/* 🔥 Drawdown Chart */}
            <div className="chart-placeholder">
              <h3>Drawdown</h3>
              {equityCurve.length === 0 ? (
                <p className="empty-state">No data</p>
              ) : (
                <DrawdownChart data={equityCurve} />
              )}
            </div>

            {/* Win / Loss */}
            <div className="chart-placeholder">
              <h3>Win / Loss</h3>
              <WinLossChart
                data={[
                  { name: "Wins", value: summary.wins },
                  { name: "Losses", value: summary.losses },
                ]}
              />
            </div>

            {/* Monthly */}
            <div className="chart-placeholder">
              <h3>Monthly Performance</h3>
              <MonthlyPerformanceChart data={monthlyPerformance} />
            </div>

            {/* Strategy */}
            <div className="chart-placeholder">
              <h3>Strategy Performance</h3>
              <StrategyPerformanceChart data={strategyPerformance} />
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Analytics;
