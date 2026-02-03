const express = require("express");
const { getCurrentUser } = require("../controllers/user.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * User routes
 * -----------
 * GET /api/users/me → authenticated user
 */
router.get("/me", protect, getCurrentUser);

module.exports = router;
