import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-notifications.css";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    tradeSyncAlerts: true,
    dailyReport: false,
    riskWarnings: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await apiRequest("/settings");

        if (data.notifications) {
          setNotifications({
            emailNotifications: data.notifications.emailNotifications ?? true,
            tradeSyncAlerts: data.notifications.tradeSyncAlerts ?? true,
            dailyReport: data.notifications.dailyReport ?? false,
            riskWarnings: data.notifications.riskWarnings ?? true,
          });
        }
      } catch (err) {
        setError("Failed to load notification settings");
      }
    };

    loadNotifications();
  }, []);

  const saveNotifications = async () => {
    setError("");
    setMessage("");

    try {
      setSaving(true);

      await apiRequest("/settings/notifications", {
        method: "PUT",
        body: JSON.stringify(notifications),
      });

      setMessage("✅ Notification settings saved");
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="notification-settings">
      {/* Header */}
      <div className="section-header">
        <h2>Notifications</h2>
        <p>Control how and when you receive alerts</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Email Notifications */}
      <div className="settings-card">
        <div className="card-header">
          <h4>Email Notifications</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  emailNotifications: e.target.checked,
                })
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        <p className="card-desc">
          Receive important updates via email.
        </p>
      </div>

      {/* Trade Alerts */}
      <div className="settings-card">
        <h4>Trade Alerts</h4>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={notifications.tradeSyncAlerts}
            disabled={!notifications.emailNotifications}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                tradeSyncAlerts: e.target.checked,
              })
            }
          />
          Notify when trades are synced
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={notifications.dailyReport}
            disabled={!notifications.emailNotifications}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                dailyReport: e.target.checked,
              })
            }
          />
          Send daily performance report
        </label>
      </div>

      {/* Risk Alerts */}
      <div className="settings-card">
        <h4>Risk Alerts</h4>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={notifications.riskWarnings}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                riskWarnings: e.target.checked,
              })
            }
          />
          Enable risk warning alerts
        </label>

        <p className="card-desc">
          Alerts when your performance drops or risk increases.
        </p>
      </div>

      {/* Info */}
      <div className="info-box">
        📩 Notifications help you stay disciplined and aware of your trading performance.
      </div>

      {/* Action */}
      <div className="form-actions">
        <button
          className="btn primary-btn"
          onClick={saveNotifications}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Notifications"}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;