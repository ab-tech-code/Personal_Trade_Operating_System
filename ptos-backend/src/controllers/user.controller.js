const User = require("../models/User");

/**
 * getCurrentUser
 * --------------
 * Returns the authenticated user's profile.
 * Requires auth middleware.
 */
const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch user",
    });
  }
};

module.exports = { getCurrentUser };
