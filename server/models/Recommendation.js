const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: String,
  time: String,
  items: [String],
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goal: { type: String, required: true },
  mode: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  meals: [mealSchema],
  totalCalories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Recommendation", recommendationSchema);
