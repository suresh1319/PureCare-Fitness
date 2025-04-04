const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
router.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Create a chat session
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "You are a helpful fitness and gym assistant for PureCare Gym. You should provide accurate, helpful, and friendly responses about fitness, gym-related questions, workout plans, nutrition advice, and general health tips. Keep your responses concise but informative. If you're not sure about something, say so rather than providing incorrect information."
                },
                {
                    role: "model",
                    parts: "I understand. I'll be a helpful and knowledgeable fitness assistant for PureCare Gym, providing accurate and friendly responses about fitness, workouts, nutrition, and health. I'll keep my answers concise but informative, and I'll be honest if I'm unsure about something."
                }
            ],
        });

        // Send the message and get the response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

module.exports = router; 