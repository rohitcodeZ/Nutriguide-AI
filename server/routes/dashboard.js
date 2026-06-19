const express = require("express");
const NutritionLog = require("../models/NutritionLog");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();



router.get("/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await NutritionLog.find({ userId: req.user._id, loggedAt: { $gte: today, $lt: tomorrow } });
    const todayCalories = todayLogs.reduce((s, l) => s + l.calories, 0);
    const todayWater = todayLogs.reduce((s, l) => s + (l.water || 0), 0);
    const todayProtein = todayLogs.reduce((s, l) => s + (l.protein || 0), 0);
    const todayCarbs = todayLogs.reduce((s, l) => s + (l.carbs || 0), 0);
    const todayFat = todayLogs.reduce((s, l) => s + (l.fat || 0), 0);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyCalories = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        const dEnd = new Date(d);
        dEnd.setDate(dEnd.getDate() + 1);
        const dayLogs = await NutritionLog.find({ userId: req.user._id, loggedAt: { $gte: d, $lt: dEnd } });
        return { day: dayNames[d.getDay()], calories: dayLogs.reduce((s, l) => s + l.calories, 0) };
      })
    );

    const goalCalories = { weight_loss: 1400, weight_gain: 2500, muscle_gain: 2800, maintenance: 2000 };
    const calorieGoal = goalCalories[req.user.goal] || 2000;
    const allUserLogs = await NutritionLog.find({ userId: req.user._id });
    const streakDays = Math.min(allUserLogs.length > 0 ? Math.ceil(allUserLogs.length / 3) : 0, 30);

    res.json({ todayCalories, todayWater, todayProtein, todayCarbs, todayFat, calorieGoal, weeklyCalories, streakDays, totalLogs: allUserLogs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/dashboard/insights", authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayLogs = await NutritionLog.find({ userId: req.user._id, loggedAt: { $gte: today, $lt: tomorrow } });
    const todayCalories = todayLogs.reduce((s, l) => s + l.calories, 0);
    const todayWater = todayLogs.reduce((s, l) => s + (l.water || 0), 0);
    const todayProtein = todayLogs.reduce((s, l) => s + (l.protein || 0), 0);

    const insights = [];
    let id = 1;
    const goalMsgs = { weight_loss: "Keep calories below 1400 today. You're doing great!", muscle_gain: "Aim for 150g+ protein today to support muscle growth.", weight_gain: "Don't forget your caloric surplus — eat every 3-4 hours.", maintenance: "Stay consistent with balanced macros for optimal energy." };
    insights.push({ id: id++, type: "goal", message: goalMsgs[req.user.goal] || "Track your meals consistently for best results.", severity: "info" });
    if (todayCalories === 0) insights.push({ id: id++, type: "calories", message: "No meals logged today — start tracking to get personalised insights!", severity: "warning" });
    else if (todayCalories > 2500) insights.push({ id: id++, type: "calories", message: `You've consumed ${todayCalories} kcal today — consider lighter options for dinner.`, severity: "warning" });
    else insights.push({ id: id++, type: "calories", message: `Great progress! ${todayCalories} kcal consumed so far today.`, severity: "success" });
    if (todayWater < 2) insights.push({ id: id++, type: "hydration", message: "Drink more water! Aim for 2-3L daily. Hydration boosts metabolism by 30%.", severity: "tip" });
    else insights.push({ id: id++, type: "hydration", message: `Excellent hydration! ${todayWater.toFixed(1)}L consumed. Keep it up!`, severity: "success" });
    if (todayProtein < 50 && todayCalories > 0) insights.push({ id: id++, type: "protein", message: "Protein intake is low. Add dal, paneer, eggs or legumes to boost protein.", severity: "warning" });
    const hour = new Date().getHours();
    if (hour < 9) insights.push({ id: id++, type: "timing", message: "Start your day with warm lemon water to kickstart metabolism!", severity: "tip" });
    else if (hour > 19) insights.push({ id: id++, type: "timing", message: "Keep dinner light and eat 2-3 hours before sleep for better digestion.", severity: "tip" });
    else insights.push({ id: id++, type: "timing", message: "Mid-day is ideal for your largest meal. Digestion is strongest between 12-2 PM.", severity: "info" });
    const tips = ["Include turmeric in your cooking — its anti-inflammatory properties fight seasonal illness.", "Eat seasonal fruits and vegetables for maximum nutritional value.", "Add ginger and tulsi to your diet to boost immunity naturally."];
    insights.push({ id: id++, type: "seasonal", message: tips[new Date().getMonth() % 3], severity: "tip" });
    res.json(insights.slice(0, 6));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
 