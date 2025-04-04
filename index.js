const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const chatRouter = require('./routes/chat');
require('dotenv').config();

// Middleware setup
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the chat router
app.use('/', chatRouter);

// Middleware to add current path to all views
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'PureCare Gym - Home' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us - PureCare Gym' });
});

app.get('/register', (req, res) => {
    res.render('peter', { title: 'Register - PureCare Gym', noNavbar: true });
});

app.get('/chat', (req, res) => {
    res.render('chat', { title: 'Chat - PureCare Gym' });
});

app.get('/services', (req, res) => {
    res.render('service', { title: 'Services - PureCare Gym' });
});

app.get('/trainers', (req, res) => {
    res.render('trainers', { title: 'Trainers - PureCare Gym' });
});

app.get('/gyms', (req, res) => {
    res.render('gyms', { title: 'Gyms - PureCare Gym' });
});

app.get('/supplementaries', (req, res) => {
    res.render('supplementaries', { title: 'Supplementaries - PureCare Gym' });
});

app.get('/reviews', (req, res) => {
    res.render('reviews', { title: 'Reviews - PureCare Gym' });
});

app.get('/knowmore', (req, res) => {
    res.render('knowmore', { title: 'About Us - PureCare Gym' });
});

app.get('/about', (req, res) => {
    res.render('knowmore');
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - PureCare Gym', noNavbar: true });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Add your authentication logic here
    res.redirect('/');
});

app.post('/register', (req, res) => {
    const { name, email, password, phone, userType, certification, experience, specialization } = req.body;
    // Add your registration logic here
    res.redirect('/');
});

// Social login routes
app.get('/auth/google/callback', (req, res) => {
    const { code } = req.query;
    // Handle Google OAuth callback
    res.redirect('/');
});

app.get('/auth/facebook/callback', (req, res) => {
    const { code } = req.query;
    // Handle Facebook OAuth callback
    res.redirect('/');
});

app.get('/auth/apple/callback', (req, res) => {
    const { code } = req.query;
    // Handle Apple OAuth callback
    res.redirect('/');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});