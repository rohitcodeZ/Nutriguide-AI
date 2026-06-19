const { Router } = require("express");
const Recommendation = require("../models/Recommendation");
const { authMiddleware } = require("../middleware/auth");
const client = require("../services/deepseek"); // Points to your Groq client wrapper configuration

const router = Router();

/*
========================================
FETCH USER HISTORY
========================================
*/
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const { goal, mode, limit } = req.query;
    const query = { userId: req.user._id };
    if (goal) query.goal = goal;
    if (mode) query.mode = mode;
    
    let results = Recommendation.find(query).sort({ createdAt: -1 });
    if (limit) results = results.limit(parseInt(limit));
    
    res.json(await results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
========================================
DYNAMIC AI DIET PLAN GENERATOR (GROQ)
========================================
*/
router.post("/recommendations", authMiddleware, async (req, res) => {
  try {
    const { 
      goal = "maintenance", 
      mode = "veg", 
      activityLevel = "moderate", 
      age = 22, 
      weight = 70, 
      height = 170 
    } = req.body;

    const modeLabel = mode === "veg" ? "Vegetarian" : "Non-Vegetarian";
    const goalLabel = goal.replace("_", " ");

    // Create a seed based on milliseconds to continuously disrupt the internal logprobs of the model
    const dynamicSeed = Date.now();

    const prompt = `
You are a highly creative, world-class sports nutritionist. Generate a completely unique, randomized 1-day diet plan layout.
Unique Request Tracking Token Seed: ${dynamicSeed}

User Profile Details:
- Diet Restrictions: ${modeLabel}
- Health Objective: ${goalLabel}
- Daily Energy Expenditure: ${activityLevel}
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm

STRICT VARIETY AND RANDOMIZATION MANDATES:
1. DO NOT reuse basic default boilerplate options for meals. 
2. CRITICAL Breakfast rule: WIPE OUT standard repetitions. Avoid always defaulting to "Oatmeal", "Moong Dal Chilla", "Poha", or "Egg White Omelette". 
3. Think outside the box: Cycle unpredictably between completely different food types (e.g., South Indian variations like Idli/Dosa/Uttapam combinations, unique stuffed multigrain flatbread variants, alternative savory masalas, high-protein smoothies, regional stir-frys, healthy wraps, etc.).
4. Surprise the user: Every single time this endpoint triggers, it should suggest completely different recipes and combinations compared to standard nutritional guides.
5. Dietary Integrity: If mode is veg, strictly keep it 100% vegetarian. If non_veg, you can creatively use fish, chicken, meats, or eggs.

Return ONLY a valid JSON object matching the schema layout structural blueprint below. Do not output markdown backticks (such as \`\`\`json) or any conversational text.

Schema Layout Blueprint:
{
  "title": "AI-Generated Unique ${modeLabel} ${goalLabel.charAt(0).toUpperCase() + goalLabel.slice(1)} Tracker Blueprint",
  "description": "An completely unique meal logging chart curated dynamically with high food ingredient variance.",
  "totalCalories": 1720,
  "protein": 70,
  "carbs": 215,
  "fat": 42,
  "meals": [
    { "name": "Breakfast", "time": "8:00 AM", "calories": 420, "protein": 18, "carbs": 52, "fat": 12, "items": ["Randomized Unique Option 1", "Randomized Unique Side 2"] },
    { "name": "Mid-morning", "time": "11:00 AM", "calories": 140, "protein": 4, "carbs": 22, "fat": 4, "items": ["Randomized Snack Option"] },
    { "name": "Lunch", "time": "1:30 PM", "calories": 560, "protein": 28, "carbs": 72, "fat": 14, "items": ["Randomized Lunch Core Component", "Randomized Salad/Accompaniment"] },
    { "name": "Snack", "time": "4:30 PM", "calories": 160, "protein": 6, "carbs": 24, "fat": 4, "items": ["Randomized Unique Refreshment Option"] },
    { "name": "Dinner", "time": "8:00 PM", "calories": 440, "protein": 14, "carbs": 45, "fat": 8, "items": ["Randomized Light Dinner Base", "Randomized Unique Veg/Protein Curry"] }
  ]
}
`;

    // Temperature bumped to 0.85 and combined with dynamic prompt randomization to maximize the randomness window
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85, 
    });

    const aiText = response.choices[0].message.content;
    
    const cleanText = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const aiData = JSON.parse(cleanText);

    // Save dynamically calculated results cleanly into MongoDB Recommendation log
    const rec = await Recommendation.create({
      userId: req.user._id,
      goal,
      mode,
      title: aiData.title || `AI-Generated ${modeLabel} Plan`,
      description: aiData.description || "Your personalized AI nutrition tracker log.",
      totalCalories: aiData.totalCalories || 1800,
      protein: aiData.protein || 60,
      carbs: aiData.carbs || 200,
      fat: aiData.fat || 40,
      meals: aiData.meals || []
    });

    res.status(201).json(rec);
  } catch (err) {
    console.error("❌ ERROR GENERATING AI DIET PLAN:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
========================================
GET SINGLE SPECIFIC DIET RECORD
========================================
*/
router.get("/recommendations/:id", authMiddleware, async (req, res) => {
  try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return res.status(404).json({ error: "Recommendation not found" });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
========================================
DELETE DIET RECOMMENDATION PLAN
========================================
*/
router.delete("/recommendations/:id", authMiddleware, async (req, res) => {
  try {
    const deletedPlan = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id 
    });

    if (!deletedPlan) {
      return res.status(404).json({ error: "Diet recommendation record not found or unauthorized access." });
    }

    res.status(200).json({ message: "Diet recommendation successfully deleted from database log." });
  } catch (err) {
    console.error("❌ ERROR Wiping Diet Plan Document:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;