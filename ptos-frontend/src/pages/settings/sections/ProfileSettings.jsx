import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-profile.css";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    timezone: "UTC",
    baseCurrency: "USD",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest("/settings");

        setProfile({
          username: data.profile?.username || "",
          email: data.profile?.email || "",
          timezone: data.profile?.timezone || "UTC",
          baseCurrency: data.profile?.baseCurrency || "USD",
        });
      } catch (err) {
        setError("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  const validate = () => {
    if (!profile.username.trim()) {
      return "Username is required";
    }

    if (!profile.email.includes("@")) {
      return "Invalid email address";
    }

    return null;
  };

  const saveProfile = async () => {
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/settings/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      setMessage("✅ Profile updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-settings">
      {/* Header */}
      <div className="section-header">
        <h2>Profile Information</h2>
        <p>Update your personal account details</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Form */}
      <div className="form-grid">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Timezone</label>
          <select
            value={profile.timezone}
            onChange={(e) =>
              setProfile({ ...profile, timezone: e.target.value })
            }
          >
            <option value="UTC">UTC</option>
            <option value="UTC+1">UTC+1 (Nigeria)</option>
            <option value="UTC+2">UTC+2</option>
            <option value="UTC-5">UTC-5</option>
          </select>
        </div>

        <div className="form-group">
          <label>Base Currency</label>
          <select
            value={profile.baseCurrency}
            onChange={(e) =>
              setProfile({
                ...profile,
                baseCurrency: e.target.value,
              })
            }
          >
            <option value="USD">USD</option>
            <option value="USDT">USDT</option>
            <option value="EUR">EUR</option>
            <option value="NGN">NGN</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="form-actions">
        <button className="btn primary-btn" onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;