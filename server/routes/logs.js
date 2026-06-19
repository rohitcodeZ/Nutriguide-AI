const express = require("express");
const NutritionLog = require("../models/NutritionLog");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/logs", authMiddleware, async (req, res) => {
  try {
    const { date, limit } = req.query;

    const query = {
      userId: req.user._id,
    };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      query.loggedAt = {
        $gte: start,
        $lt: end,
      };
    } else {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      query.loggedAt = {
        $gte: today,
        $lt: tomorrow,
      };
    }

    let results = NutritionLog.find(query)
      .sort({ loggedAt: -1 });

    if (limit) {
      results = results.limit(
        parseInt(limit)
      );
    }

    res.json(await results);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/logs", authMiddleware, async (req, res) => {
  try {
    const {
      foodName,
      calories,
      protein,
      carbs,
      fat,
      water,
      mealType,
    } = req.body;

    if (
      !foodName ||
      !calories ||
      !mealType
    ) {
      return res.status(400).json({
        error:
          "foodName, calories and mealType are required",
      });
    }

    const log =
      await NutritionLog.create({
        userId: req.user._id,
        foodName,
        calories,
        protein,
        carbs,
        fat,
        water,
        mealType,
      });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.delete("/logs/:id", authMiddleware, async (req, res) => {
  try {
    const log =
      await NutritionLog.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!log) {
      return res.status(404).json({
        error: "Log not found",
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;