const service = require("./settings.service");

exports.getSettings = async (req, res) => {
  const settings = await service.getSettings(req.user.id);
  res.json(settings);
};

exports.updateProfile = async (req, res) => {
  const result = await service.updateProfile(req.user.id, req.body);
  res.json(result);
};

exports.changePassword = async (req, res) => {
  const result = await service.changePassword(req.user.id, req.body);
  res.json(result);
};

exports.updatePreferences = async (req, res) => {
  const result = await service.updatePreferences(req.user.id, req.body);
  res.json(result);
};

exports.updateExchangeSettings = async (req, res) => {
  const result = await service.updateExchangeSettings(req.user.id, req.body);
  res.json(result);
};

exports.updateNotifications = async (req, res) => {
  const result = await service.updateNotifications(req.user.id, req.body);
  res.json(result);
};

exports.disconnectExchanges = async (req, res) => {
  const result = await service.disconnectExchanges(req.user.id);
  res.json(result);
};

exports.resetTrades = async (req, res) => {
  const result = await service.resetTrades(req.user.id);
  res.json(result);
};

exports.deleteAccount = async (req, res) => {
  const result = await service.deleteAccount(req.user.id);
  res.json(result);
};