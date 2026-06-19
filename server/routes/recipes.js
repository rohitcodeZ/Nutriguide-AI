const express = require("express");
const Recipe = require("../models/Recipe");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

/*
========================================
AI CLIENT CONFIG
========================================
*/
const client = require("../services/deepseek"); // Points to your Groq adapter file

/*
========================================
AI DIET + RECIPE GENERATOR (CACHE BYPASS)
========================================
*/
router.post("/recipes/generate", async (req, res) => {
  try {
    const {
      mode = "veg",
      goal = "maintenance",
      age = 22,
      weight = 70,
      height = 170,
      ingredients = [],
    } = req.body;

    let prompt = "";
    
    // 💥 GENERATE A TOTALLY RANDOMIZED SEED NUMBER AND TIMESTAMP TO SHATTER GROQ CACHING
    const dynamicSeedModifier = Math.floor(Math.random() * 1000000) + Date.now();

    if (ingredients && ingredients.length > 0) {
      /*
      ========================================
      INGREDIENT BASED AI RECIPES
      ========================================
      */
      prompt = `
Generate a completely unique selection of alternative AI recipes using these ingredients: ${ingredients.join(", ")}
Bypass Token Key: [${dynamicSeedModifier}]
Diet Type: ${mode}

VARIETY MANDATE:
- Do not default to predictable common dishes. Mix up cooking steps and seasoning parameters.
- If mode is veg: - ONLY vegetarian recipes
- If mode is non_veg: - include chicken, eggs, fish etc.

Return ONLY a valid JSON ARRAY. Do not include markdown wraps or filler conversations.
Format:
[
  {
    "id": 1,
    "name": "Completely Unique Recipe Title",
    "description": "Creative short description of flavor profile",
    "calories": 250,
    "ingredients": [],
    "instructions": [],
    "protein": 0,
    "carbs": 0,
    "fat": 0
  }
]`;
    } else {
      /*
      ========================================
      AI DIET PLAN GENERATOR (DASHBOARD MACROS SCHEMATIC)
      ========================================
      */
      prompt = `
You are an advanced, creative culinary AI. Generate a unique, randomized 1-day diet plan dashboard.
Bypass Token Key: [${dynamicSeedModifier}]

User Profile:
- Diet Type: ${mode}
- Goal: ${goal}
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm

STRICT VARIETY AND RANDOMIZATION MANDATES:
- DO NOT repeat previous suggestions. WOUILD NOT reuse standard default options.
- Explicitly avoid basic repetitions like defaulting to plain oatmeal, moong dal chillas, or white rices for breakfast/meals.
- Pull from diverse cuisines (South Indian, North Indian, continental fusion, protein smoothies, distinct healthy wraps).
- If mode is veg: - ONLY vegetarian foods
- If mode is non_veg: - include chicken, fish, eggs etc.

Calculate precise macros. Return ONLY a valid JSON ARRAY containing exactly one object with the layout below. Do not wrap inside introduction context.

Format:
[
  {
    "title": "AI-Generated ${mode === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} Balanced ${goal.charAt(0).toUpperCase() + goal.slice(1)} Plan",
    "description": "A completely fresh everyday plan to target your fitness goals and stabilize energy metrics.",
    "goalTag": "${goal}",
    "modeTag": "${mode}",
    "totalCalories": 1560,
    "protein": 55,
    "carbs": 240,
    "fat": 40,
    "meals": {
      "breakfast": { "name": "Fresh Random Breakfast Idea Name", "description": "Short explanation of ingredients", "calories": 400 },
      "lunch": { "name": "Fresh Random Lunch Idea Name", "description": "Short explanation of ingredients", "calories": 550 },
      "dinner": { "name": "Fresh Random Dinner Idea Name", "description": "Short explanation of ingredients", "calories": 420 },
      "snacks": { "name": "Fresh Random Snack Idea Name", "description": "Short explanation of ingredients", "calories": 190 }
    }
  }
]`;
    }

    // 💥 PASSING SYSTEM MESSAGES AND SEEDS EXPLICITLY BREAKS VERBATIM CACHED REPETITIONS
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: `You are a dynamic recipe creator context token engine. Core variance hash identifier value: ${dynamicSeedModifier}. You must provide a brand new recipe selection on every prompt interaction loop.` 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.85, // Bumping up creativity sampling parameters safely
      seed: dynamicSeedModifier // Forces distinct mathematical random number generator tracks
    });

    const aiText = response.choices[0].message.content;
    console.log("--- AI OUTPUT ---", aiText);

    const cleanText = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      let parsedData = JSON.parse(cleanText);

      // Safety check: ensure output is an array
      if (!Array.isArray(parsedData)) {
        parsedData = [parsedData];
      }

      return res.json(parsedData);
    } catch (jsonErr) {
      console.error("❌ JSON Parse Failed. Raw Response:", cleanText);
      return res.status(502).json({
        error: "AI formatting returned invalid syntax.",
        details: jsonErr.message,
      });
    }

  } catch (err) {
    console.error("❌ SERVER GENERATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
========================================
GET ALL RECIPES
========================================
*/
router.get("/recipes", async (req, res) => {
  try {
    const { mode, category, search, limit } = req.query;
    const query = {};

    if (mode && mode !== "all") query.mode = mode;

    if (category)
      query.category = {
        $regex: category,
        $options: "i",
      };

    if (search)
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];

    let results = Recipe.find(query);

    if (limit) results = results.limit(parseInt(limit));

    res.json(await results);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
========================================
CREATE RECIPE
========================================
*/
router.post("/recipes", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      mode,
      category,
      description,
      ingredients,
      instructions,
      calories,
      protein,
      carbs,
      fat,
      prepTime,
      cookTime,
    } = req.body;

    if (
      !name ||
      !mode ||
      !category ||
      !ingredients ||
      !instructions ||
      !calories
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const recipe = await Recipe.create({
      name,
      mode,
      category,
      description,
      ingredients,
      instructions,
      calories,
      protein,
      carbs,
      fat,
      prepTime,
      cookTime,
    });

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
========================================
GET SINGLE RECIPE
========================================
*/
router.get("/recipes/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        error: "Recipe not found",
      });
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
========================================
DELETE RECIPE
========================================
*/
router.delete("/recipes/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        error: "Recipe not found",
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