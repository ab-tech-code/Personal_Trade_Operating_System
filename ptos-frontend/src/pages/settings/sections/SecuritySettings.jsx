import React, { useState } from "react";
import { apiRequest } from "../../../services/api";

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const changePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    setSaving(true);

    await apiRequest("/settings/password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    });

    setSaving(false);
    setMessage("Password updated successfully");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="settings-section">
      <h2>Security</h2>

      <label>
        Current Password
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              currentPassword: e.target.value,
            })
          }
        />
      </label>

      <label>
        New Password
        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              newPassword: e.target.value,
            })
          }
        />
      </label>

      <label>
        Confirm New Password
        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              confirmPassword: e.target.value,
            })
          }
        />
      </label>

      <button className="btn" onClick={changePassword} disabled={saving}>
        {saving ? "Updating..." : "Change Password"}
      </button>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default SecuritySettings;