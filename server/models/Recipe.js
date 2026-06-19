const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mode: { type: String, enum: ["veg", "non_veg"], required: true },
  category: { type: String, required: true },
  description: { type: String, default: null },
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
  calories: { type: Number, required: true },
  protein: { type: Number, default: null },
  carbs: { type: Number, default: null },
  fat: { type: Number, default: null },
  prepTime: { type: Number, default: null },
  cookTime: { type: Number, default: null },
  imageUrl: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
