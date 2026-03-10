import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    timezone: "UTC",
    baseCurrency: "USD",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const data = await apiRequest("/settings");

      setProfile({
        username: data.profile?.username || "",
        email: data.profile?.email || "",
        timezone: data.profile?.timezone || "UTC",
        baseCurrency: data.profile?.baseCurrency || "USD",
      });
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    setSaving(true);

    await apiRequest("/settings/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });

    setSaving(false);
    setMessage("Profile updated successfully");
  };

  return (
    <div className="settings-section">
      <h2>Profile</h2>

      <label>
        Username
        <input
          type="text"
          value={profile.username}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
        />
      </label>

      <label>
        Timezone
        <select
          value={profile.timezone}
          onChange={(e) =>
            setProfile({ ...profile, timezone: e.target.value })
          }
        >
          <option value="UTC">UTC</option>
          <option value="UTC+1">UTC+1</option>
          <option value="UTC+2">UTC+2</option>
          <option value="UTC-5">UTC-5</option>
        </select>
      </label>

      <label>
        Base Currency
        <select
          value={profile.baseCurrency}
          onChange={(e) =>
            setProfile({ ...profile, baseCurrency: e.target.value })
          }
        >
          <option>USD</option>
          <option>EUR</option>
          <option>NGN</option>
          <option>USDT</option>
        </select>
      </label>

      <button className="btn" onClick={saveProfile} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default ProfileSettings;