import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    tradeSyncAlerts: true,
    dailyReport: false,
    riskWarnings: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await apiRequest("/settings");

      if (data.notifications) {
        setNotifications({
          emailNotifications: data.notifications.emailNotifications ?? true,
          tradeSyncAlerts: data.notifications.tradeSyncAlerts ?? true,
          dailyReport: data.notifications.dailyReport ?? false,
          riskWarnings: data.notifications.riskWarnings ?? true,
        });
      }
    };

    loadNotifications();
  }, []);

  const saveNotifications = async () => {
    setSaving(true);

    await apiRequest("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify(notifications),
    });

    setSaving(false);
    setMessage("Notification settings saved");
  };

  return (
    <div className="settings-section">
      <h2>Notifications</h2>

      <label className="checkbox">
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
        Enable Email Notifications
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={notifications.tradeSyncAlerts}
          onChange={(e) =>
            setNotifications({
              ...notifications,
              tradeSyncAlerts: e.target.checked,
            })
          }
        />
        Notify When Trades Are Synced
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={notifications.dailyReport}
          onChange={(e) =>
            setNotifications({
              ...notifications,
              dailyReport: e.target.checked,
            })
          }
        />
        Send Daily Performance Report
      </label>

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
        Enable Risk Warning Alerts
      </label>

      <button className="btn" onClick={saveNotifications} disabled={saving}>
        {saving ? "Saving..." : "Save Notifications"}
      </button>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default NotificationSettings;