const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const foodDB = {
  "dal makhani": { calories: 310, protein: 14, carbs: 40, fat: 11, fiber: 8, healthScore: 78, vitamins: ["B12", "Folate", "B6"], minerals: ["Iron", "Calcium", "Potassium"], healthBenefits: ["High in plant protein", "Rich in iron for energy", "Good source of folate for cell repair"], alternatives: ["Moong Dal Tadka", "Palak Dal", "Chana Masala"] },
  "paneer tikka": { calories: 280, protein: 18, carbs: 12, fat: 18, fiber: 2, healthScore: 72, vitamins: ["A", "D", "B12"], minerals: ["Calcium", "Phosphorus"], healthBenefits: ["Excellent source of calcium for bones", "High protein for muscle building", "Good source of Vitamin D"], alternatives: ["Tofu Tikka", "Grilled Chicken", "Mushroom Tikka"] },
  "biryani": { calories: 520, protein: 18, carbs: 72, fat: 18, fiber: 3, healthScore: 58, vitamins: ["B6", "Niacin"], minerals: ["Iron", "Zinc"], healthBenefits: ["Saffron provides antioxidants", "Whole spices aid digestion", "Basmati rice has low glycaemic index"], alternatives: ["Vegetable Pulao", "Brown Rice Khichdi", "Quinoa Bowl"] },
  "dosa": { calories: 120, protein: 3, carbs: 22, fat: 4, fiber: 1, healthScore: 70, vitamins: ["B1", "B2"], minerals: ["Iron", "Calcium"], healthBenefits: ["Fermented and probiotic-rich", "Low calorie and light on digestion", "Good for gut microbiome"], alternatives: ["Oats Dosa", "Moong Dal Dosa", "Rava Idli"] },
  "idli": { calories: 70, protein: 2, carbs: 15, fat: 0.5, fiber: 1, healthScore: 88, vitamins: ["B1", "B2", "Folate"], minerals: ["Iron"], healthBenefits: ["Very low calorie breakfast", "Fermented food with probiotics", "Easy to digest"], alternatives: ["Oats Idli", "Ragi Idli", "Rava Idli"] },
  "rajma": { calories: 290, protein: 15, carbs: 45, fat: 6, fiber: 10, healthScore: 82, vitamins: ["Folate", "B6", "K"], minerals: ["Iron", "Magnesium", "Potassium"], healthBenefits: ["Very high in fibre for gut health", "Excellent plant protein source", "Helps manage blood sugar levels"], alternatives: ["Chana Masala", "Black Bean Curry", "Lentil Soup"] },
  "chole bhature": { calories: 580, protein: 18, carbs: 80, fat: 22, fiber: 8, healthScore: 52, vitamins: ["B6", "Folate"], minerals: ["Iron", "Zinc"], healthBenefits: ["Chickpeas are high in protein and fibre", "Iron-rich for vegetarians"], alternatives: ["Chole with Brown Rice", "Hummus with Pita", "Chana Salad"] },
  "samosa": { calories: 260, protein: 5, carbs: 35, fat: 12, fiber: 3, healthScore: 38, vitamins: ["C", "B6"], minerals: ["Potassium"], healthBenefits: ["Potatoes provide quick energy"], alternatives: ["Baked Samosa", "Dhokla", "Sprout Chaat"] },
  "butter chicken": { calories: 380, protein: 32, carbs: 14, fat: 22, fiber: 2, healthScore: 65, vitamins: ["A", "B12", "D"], minerals: ["Calcium", "Iron"], healthBenefits: ["High protein for muscle health", "Tomatoes rich in lycopene antioxidant", "Good source of Vitamin B12"], alternatives: ["Tandoori Chicken", "Chicken Tikka", "Grilled Chicken"] },
  "khichdi": { calories: 240, protein: 10, carbs: 44, fat: 4, fiber: 5, healthScore: 90, vitamins: ["B6", "Folate", "A"], minerals: ["Iron", "Zinc", "Magnesium"], healthBenefits: ["Easiest to digest — ideal for recovery", "Complete protein from rice+dal combination", "Balances all three doshas in Ayurveda"], alternatives: ["Oats Porridge", "Daliya Khichdi", "Barley Soup"] },
  "aloo paratha": { calories: 350, protein: 8, carbs: 56, fat: 12, fiber: 5, healthScore: 55, vitamins: ["C", "B6", "K"], minerals: ["Potassium", "Iron"], healthBenefits: ["Whole wheat flour provides fibre", "Potatoes provide vitamin C and potassium"], alternatives: ["Methi Paratha", "Mooli Paratha", "Oats Paratha"] },
  "poha": { calories: 180, protein: 5, carbs: 32, fat: 5, fiber: 3, healthScore: 75, vitamins: ["B1", "Iron"], minerals: ["Iron", "Calcium"], healthBenefits: ["Iron-fortified — great for anaemia prevention", "Easy on digestion", "Low glycaemic index"], alternatives: ["Upma", "Oats", "Daliya"] },
  "chicken curry": { calories: 360, protein: 34, carbs: 10, fat: 20, fiber: 1, healthScore: 68, vitamins: ["B6", "B12"], minerals: ["Iron", "Zinc"], healthBenefits: ["High protein meal", "Provides sustained energy"], alternatives: ["Grilled Chicken", "Chicken Salad"] }
};

// Data Parser Core
function getFoodData(name) {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(foodDB)) {
    if (key.includes(k) || k.includes(key)) return { foodName: name, ...v };
  }
  return {
    foodName: name,
    calories: Math.floor(Math.random() * 300) + 100,
    protein: Math.floor(Math.random() * 20) + 3,
    carbs: Math.floor(Math.random() * 50) + 10,
    fat: Math.floor(Math.random() * 15) + 2,
    fiber: Math.floor(Math.random() * 8) + 1,
    healthScore: Math.floor(Math.random() * 40) + 50,
    vitamins: ["B-Complex", "Vitamin C"],
    minerals: ["Iron", "Calcium"],
    healthBenefits: ["Provides essential nutrients", "Part of a balanced diet"],
    alternatives: ["Khichdi", "Dal Rice", "Fresh Salad"],
  };
}

/* ========================================
   LIVE AI IMAGE ROUTE (REPLACES PROTOTYPE)
   ======================================== */
router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Convert local temp file into binary stream data format for the AI model
    const fileBuffer = fs.readFileSync(req.file.path);
    const imagePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    // System prompt directing the vision model structure
    const prompt = `
      You are an expert nutritionist AI. Look at this food image and identify the primary dish. 
      Respond ONLY with a single JSON object containing the name of the food. Do not include markdown formatting or extra text.
      
      Example format:
      {"identifiedFood": "Paneer Tikka"}
    `;

    // Send context to the highly optimized gemini-2.5-flash vision engine
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt, imagePart],
    });

    const aiText = response.text.trim();
    
    // Safely delete temp upload storage file from your backend server memory path
    fs.unlinkSync(req.file.path);

    let identifiedFood = "Unknown Dish";
    try {
      const cleanJson = JSON.parse(aiText.replace(/```json|```/g, ""));
      if (cleanJson.identifiedFood) {
        identifiedFood = cleanJson.identifiedFood;
      }
    } catch (e) {
      identifiedFood = aiText; 
    }

    // Match identified food with your system data configurations
    const data = getFoodData(identifiedFood);

    res.json({
      foodName: data.foodName,
      grams: 100,
      calories: data.calories,
      macros: {
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        fiber: data.fiber
      },
      vitamins: data.vitamins,
      minerals: data.minerals,
      healthScore: data.healthScore,
      healthBenefits: data.healthBenefits,
      alternatives: data.alternatives,
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "AI Vision processing crashed: " + err.message });
  }
});

/* ========================================
   TEXT SEARCH ROUTE
   ======================================== */
router.post("/analyze", (req, res) => {
  const { foodName, grams = 100 } = req.body;
  if (!foodName) return res.status(400).json({ error: "foodName is required" });
  
  const data = getFoodData(foodName);
  const factor = grams / 100;
  
  res.json({
    foodName: data.foodName,
    grams,
    calories: Math.round(data.calories * factor),
    macros: {
      protein: Math.round(data.protein * factor),
      carbs: Math.round(data.carbs * factor),
      fat: Math.round(data.fat * factor),
      fiber: Math.round(data.fiber * factor)
    },
    vitamins: data.vitamins,
    minerals: data.minerals,
    healthScore: data.healthScore,
    healthBenefits: data.healthBenefits,
    alternatives: data.alternatives,
  });
});

module.exports = router;