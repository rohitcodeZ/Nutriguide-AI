const { Router } = require("express");
const client = require("../services/deepseek"); // Points to your Groq client wrapper configuration

const router = Router();

/*
========================================
LOCATION BASED DIET SUGGESTIONS (DYNAMIC AI)
========================================
*/
router.get("/location", async (req, res) => {
  try {
    const { state = "Punjab" } = req.query;

    const dynamicSeedModifier = Math.floor(Math.random() * 1000000) + Date.now();

    const prompt = `
Generate a highly specific, authentic local diet suggestion array for the Indian state of: ${state}.
Bypass Token Key: [${dynamicSeedModifier}]

CRITICAL REQUIREMENT:
- Base the foods entirely on true regional staples, traditional grain crops, and local culinary specialities unique to ${state}. Do not output generic items.

Return ONLY a valid JSON ARRAY containing exactly one object matching this schema blueprint structure. No markdown code wraps, no conversational commentary.

Schema Blueprint:
[
  {
    "id": ${Math.floor(Math.random() * 900) + 100},
    "title": "${state} Traditional Fitness Diet",
    "description": "Authentic regional foods native to ${state} optimized for raw energy, natural strength, and health.",
    "foods": ["Regional Item 1", "Regional Item 2", "Regional Item 3", "Regional Item 4"],
    "meals": ["Regional Item 1", "Regional Item 2", "Regional Item 3", "Regional Item 4"],
    "benefits": ["Benefit statement 1", "Benefit statement 2", "Benefit statement 3"],
    "tags": ["${state.toLowerCase()}", "traditional", "regional"]
  }
]`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: `You are a regional Indian culinary expert system. Core variance hash identifier: ${dynamicSeedModifier}. Output arrays containing both 'meals' and 'foods' keys with identical string listings to handle variable frontend properties safely.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      seed: dynamicSeedModifier
    });

    const aiText = response.choices[0].message.content;
    const cleanText = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    return res.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("❌ Failed to fetch dynamic location suggestions:", error);
    res.status(500).json({ error: "Failed to fetch dynamic regional suggestions" });
  }
});

/*
========================================
WEATHER BASED DIET SUGGESTIONS (DYNAMIC AI)
========================================
*/
router.get("/weather", async (req, res) => {
  try {
    let { season } = req.query;

    if (!season) {
      const currentMonth = new Date().getMonth(); 
      if (currentMonth >= 2 && currentMonth <= 5) {
        season = "summer";
      } else if (currentMonth >= 6 && currentMonth <= 8) {
        season = "rainy";
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        season = "spring"; 
      } else {
        season = "winter";
      }
    }

    const dynamicSeedModifier = Math.floor(Math.random() * 1000000) + Date.now();

    const prompt = `
Generate a highly creative seasonal diet suggestion layout targeting optimal human thermal comfort and metabolic health for this weather profile: ${season}.
Bypass Token Key: [${dynamicSeedModifier}]

Return ONLY a valid JSON ARRAY containing exactly one object matching this schema blueprint structure. Do not include markdown wrapped tags.

Schema Blueprint:
[
  {
    "id": ${Math.floor(Math.random() * 900) + 100},
    "title": "${season.charAt(0).toUpperCase() + season.slice(1)} Optimizing Bio-Foods",
    "description": "A tailored macro-micro dietary configuration explicitly designed to support your body during the ${season} season.",
    "foods": ["Seasonal Ingredient 1", "Seasonal Ingredient 2", "Seasonal Ingredient 3", "Seasonal Ingredient 4"],
    "meals": ["Seasonal Ingredient 1", "Seasonal Ingredient 2", "Seasonal Ingredient 3", "Seasonal Ingredient 4"],
    "benefits": ["Thermal/Immunity benefit 1", "Digestion/Energy benefit 2"],
    "tags": ["${season}"]
  }
]`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: `You are an Ayurvedic and seasonal macro scientist. Core variance hash identifier: ${dynamicSeedModifier}. Provide both 'meals' and 'foods' lists with matching parameters.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      seed: dynamicSeedModifier
    });

    const aiText = response.choices[0].message.content;
    const cleanText = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    return res.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("❌ Failed to fetch dynamic weather suggestions:", error);
    res.status(500).json({ error: "Failed to fetch dynamic weather suggestions" });
  }
});

module.exports = router;