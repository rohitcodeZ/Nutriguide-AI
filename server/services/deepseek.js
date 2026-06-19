const Groq = require("groq-sdk");

// Initialize the Groq Client (automatically reads process.env.GROQ_API_KEY)
const groq = new Groq();

const client = {
  chat: {
    completions: {
      create: async ({ messages }) => {
        // Redirect directly into Groq's engine using a powerful model
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile", 
          messages: messages,
          temperature: 0.2, // Low temperature keeps output predictable and strictly JSON-safe
        });

        return response;
      },
    },
  },
};

module.exports = client;