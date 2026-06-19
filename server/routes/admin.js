const { Router } = require("express");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const NutritionLog = require("../models/NutritionLog");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = Router();

router.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/analytics", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalLogs = await NutritionLog.countDocuments();
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const signupsThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });
    const usersWithLogs = await NutritionLog.distinct("userId");
    const activeUsers = usersWithLogs.length;
    const goalAgg = await User.aggregate([{ $group: { _id: "$goal", count: { $sum: 1 } } }]);
    const topGoals = goalAgg.map((g) => ({ goal: g._id || "maintenance", count: g.count })).sort((a, b) => b.count - a.count);
    res.json({ totalUsers, totalRecipes, totalLogs, activeUsers, topGoals, signupsThisWeek });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
