const express = require("express");
const client = require("../services/deepseek");

const router = express.Router();

/*
========================================
AI Diet Plan Generator
========================================
*/
router.post("/diet-plan", async (req, res) => {
  try {
    const { age, weight, goal, dietType } = req.body;

    const prompt = `
Create a healthy diet plan.

Age: ${age}
Weight: ${weight}
Goal: ${goal}
Diet Type: ${dietType}

Give:
- Breakfast
- Lunch
- Dinner
- Snacks
- Calories
`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      success: true,
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI diet generation failed",
    });
  }
});

/*
========================================
AI Food Analyzer
========================================
*/
router.post("/analyze-food", async (req, res) => {
  try {
    const { food } = req.body;

    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }

    const prompt = `
Analyze this food item: ${food}

Provide:

1. Calories
2. Protein (grams)
3. Carbohydrates (grams)
4. Fat (grams)
5. Fiber (grams)
6. Health Benefits
7. Recommended Serving Size

Format the response clearly and professionally.
`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      success: true,
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Food Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Food analysis failed",
    });
  }
});

module.exports = router;