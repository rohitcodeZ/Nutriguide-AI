const mongoose = require("mongoose");

const dietSuggestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  state: { type: String, default: null },
  region: { type: String, default: null },
  season: { type: String, default: null },
  foods: [String],
  benefits: [String],
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model("DietSuggestion", dietSuggestionSchema);
