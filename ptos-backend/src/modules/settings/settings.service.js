const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const Trade = require("../../models/Trade");
const Exchange = require("../../models/Exchange");

exports.getSettings = async (userId) => {
  const user = await User.findById(userId);

  return {
    profile: {
      username: user.username,
      email: user.email,
      timezone: user.timezone || "UTC",
      baseCurrency: user.baseCurrency || "USD",
    },

    preferences: user.preferences || {},

    exchangeSettings: user.exchangeSettings || {},

    notifications: user.notifications || {},
  };
};

exports.updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  user.username = data.username;
  user.email = data.email;
  user.timezone = data.timezone;
  user.baseCurrency = data.baseCurrency;

  await user.save();

  return { message: "Profile updated" };
};

exports.changePassword = async (userId, data) => {
  const user = await User.findById(userId);

  const valid = await bcrypt.compare(data.currentPassword, user.password);

  if (!valid) {
    throw new Error("Current password incorrect");
  }

  const hashed = await bcrypt.hash(data.newPassword, 10);

  user.password = hashed;

  await user.save();

  return { message: "Password updated" };
};

exports.updatePreferences = async (userId, preferences) => {
  const user = await User.findById(userId);

  user.preferences = preferences;

  await user.save();

  return { message: "Preferences saved" };
};

exports.updateExchangeSettings = async (userId, settings) => {
  const user = await User.findById(userId);

  user.exchangeSettings = settings;

  await user.save();

  return { message: "Exchange settings saved" };
};

exports.updateNotifications = async (userId, notifications) => {
  const user = await User.findById(userId);

  user.notifications = notifications;

  await user.save();

  return { message: "Notifications updated" };
};

exports.disconnectExchanges = async (userId) => {
  await Exchange.deleteMany({ user: userId });

  return { message: "All exchanges disconnected" };
};

exports.resetTrades = async (userId) => {
  await Trade.deleteMany({ user: userId });

  return { message: "All trades deleted" };
};

exports.deleteAccount = async (userId) => {
  await Trade.deleteMany({ user: userId });
  await Exchange.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);

  return { message: "Account deleted" };
};