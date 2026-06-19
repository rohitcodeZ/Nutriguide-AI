require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const aiRoutes = require("./routes/aiRoutes");
const suggestionsRoutes = require("./routes/suggestions");
const authRoutes = require("./routes/auth");
const recipesRoutes = require("./routes/recipes");
const recommendationsRoutes = require("./routes/recommendations");
const foodRoutes = require("./routes/food");
const logsRoutes = require("./routes/logs");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");

const app = express();

const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/nutriguide";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/*
========================================
AI ROUTES
========================================
*/
app.use("/api/ai", aiRoutes);

/*
========================================
HEALTH CHECK
========================================
*/
app.get("/api/healthz", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/*
========================================
APPLICATION ROUTES
========================================
*/
app.use("/api", authRoutes);
app.use("/api", recipesRoutes);
app.use("/api", recommendationsRoutes);

/* IMPORTANT FIX */
app.use("/api/food", foodRoutes);

app.use("/api", suggestionsRoutes);
app.use("/api", logsRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", adminRoutes);

/*
========================================
ERROR HANDLER
========================================
*/
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Internal server error",
  });
});

/*
========================================
DATABASE CONNECTION
========================================
*/
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected:", MONGO_URI);

    app.listen(PORT, () => {
      console.log(
        `🚀 NutriGuide API running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });