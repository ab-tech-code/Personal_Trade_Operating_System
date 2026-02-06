require("dotenv").config();


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const tradeRoutes = require("./routes/trade.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const exchangeRoutes = require("./routes/exchange.routes");
const dashboardRoutes = require("./routes/dashboard.routes");



const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/dashboard", dashboardRoutes);


module.exports = app;
