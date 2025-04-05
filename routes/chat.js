import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat page route
router.get('/', (req, res) => {
    res.render('chat', { 
        title: 'Chat',
        noNavbar: false,
        noFooter: false
    });
});

// Chat API endpoint
router.post('/send', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        res.json({ response: text });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router; 