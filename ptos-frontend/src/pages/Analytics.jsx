import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ChartPlaceholder from "../components/ChartPlaceholder";
import EquityCurveChart from "../components/EquityCurveChart";
import { fetchEquityCurve } from "../services/analytics.service";
import Loading from "../components/Loading";

const Analytics = () => {
  const [equityCurve, setEquityCurve] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurve = async () => {
      try {
        const data = await fetchEquityCurve();
        setEquityCurve(data);
      } catch (err) {
        console.error("Error loading equity curve:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCurve();
  }, []);

  return (
    <AppLayout>
      <h1>Analytics</h1>

      <div className="analytics-grid">
        <div className="chart-placeholder">
          <h3>Equity Curve</h3>

          {loading ? (
            <Loading />
          ) : equityCurve.length === 0 ? (
            <p className="empty-state">No trades yet</p>
          ) : (
            <EquityCurveChart data={equityCurve} />
          )}
        </div>

        {/* Keeping other placeholders as they were */}
        <ChartPlaceholder title="Win / Loss Distribution" />
        <ChartPlaceholder title="Monthly Performance" />
        <ChartPlaceholder title="Strategy Performance" />
      </div>
    </AppLayout>
  );
};

export default Analytics;