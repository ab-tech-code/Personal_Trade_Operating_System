const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Trading Preferences
 */
const preferencesSchema = new mongoose.Schema(
  {
    riskPerTrade: {
      type: Number,
      default: 1,
    },
    defaultPositionSize: {
      type: Number,
      default: 10,
    },
    preferredMarket: {
      type: String,
      enum: ["Futures", "Spot", "Options"],
      default: "Futures",
    },
    defaultStopLoss: {
      type: Number,
      default: 2,
    },
  },
  { _id: false }
);

/**
 * Exchange Sync Settings
 */
const exchangeSettingsSchema = new mongoose.Schema(
  {
    autoSync: {
      type: Boolean,
      default: true,
    },
    syncInterval: {
      type: Number,
      default: 15,
    },
    importFees: {
      type: Boolean,
      default: true,
    },
    autoCloseTrades: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/**
 * Notification Settings
 */
const notificationsSchema = new mongoose.Schema(
  {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    tradeSyncAlerts: {
      type: Boolean,
      default: true,
    },
    dailyReport: {
      type: Boolean,
      default: false,
    },
    riskWarnings: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    username: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /**
     * Profile settings
     */
    timezone: {
      type: String,
      default: "UTC",
    },

    baseCurrency: {
      type: String,
      default: "USD",
    },

    /**
     * Settings sections
     */
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },

    exchangeSettings: {
      type: exchangeSettingsSchema,
      default: () => ({}),
    },

    notifications: {
      type: notificationsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

/**
 * Password hashing
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Compare password method
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);