import React, { useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-security.css";

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password strength checker
  const getStrength = (password) => {
    if (password.length < 6) return "weak";
    if (password.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) return "strong";
    return "medium";
  };

  const strength = getStrength(passwords.newPassword);

  const validate = () => {
    if (!passwords.currentPassword) return "Current password is required";

    if (passwords.newPassword.length < 6)
      return "Password must be at least 6 characters";

    if (passwords.newPassword !== passwords.confirmPassword)
      return "Passwords do not match";

    return null;
  };

  const changePassword = async () => {
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/settings/password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });

      setMessage("✅ Password updated successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="security-settings">
      {/* Header */}
      <div className="section-header">
        <h2>Security</h2>
        <p>Manage your account password and security</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Form */}
      <div className="form-group">
        <label>Current Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              currentPassword: e.target.value,
            })
          }
        />
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              newPassword: e.target.value,
            })
          }
        />

        {/* Strength Indicator */}
        {passwords.newPassword && (
          <div className={`password-strength ${strength}`}>
            Strength: {strength.toUpperCase()}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              confirmPassword: e.target.value,
            })
          }
        />
      </div>

      {/* Toggle */}
      <div className="checkbox">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <span>Show Passwords</span>
      </div>

      {/* Action */}
      <div className="form-actions">
        <button
          className="btn primary-btn"
          onClick={changePassword}
          disabled={saving}
        >
          {saving ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;