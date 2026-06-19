const mongoose = require("mongoose");

const nutritionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodName: { type: String, required: true, trim: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: null },
  carbs: { type: Number, default: null },
  fat: { type: Number, default: null },
  water: { type: Number, default: null },
  mealType: { type: String, required: true, enum: ["breakfast", "lunch", "dinner", "snack"] },
  loggedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("NutritionLog", nutritionLogSchema);
