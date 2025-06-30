import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import chatRouter from './routes/chat.js';
import User from './models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { loginUser, logoutUser, registerUser } from './controllers/authUser.js';
import isLoggedIn from './middlewares/isLoggedIn.js';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/purecarefitness')
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Add middleware to set currentPath and user for all routes
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

app.use('/chat', isLoggedIn, chatRouter);

// Home route
app.get('/',  (req, res) => {
    res.render('index', { title: 'PureCare Fitness'});
});

// Contact route
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us'});
});

// Services route
app.get('/services', isLoggedIn, (req, res) => {
    res.render('service', { title: 'Services' });
});

// Trainers route
app.get('/trainers', isLoggedIn, (req, res) => {
    res.render('trainers', { title: 'Trainers' });
});

// Gyms route
app.get('/gyms', isLoggedIn, (req, res) => {
    res.render('gyms', { title: 'Gyms' });
});

// Supplementaries route
app.get('/supplementaries', isLoggedIn, (req, res) => {
    res.render('supplementaries', { title: 'Supplementaries' });
});

// Reviews route
app.get('/reviews', isLoggedIn, (req, res) => {
    res.render('reviews', { title: 'Reviews' });
});

// About/Know More route
app.get('/about', isLoggedIn, (req, res) => {
    res.render('knowmore', { title: 'About Us' });
});

app.get('/knowmore', isLoggedIn, (req, res) => {
    res.render('knowmore', { title: 'About Us' });
});

app.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login',
        noNavbar: true,
        noFooter: true
    });
});

app.get('/register', (req, res) => {
    res.render('peter', { 
        title: 'Register',
        noNavbar: true,
        noFooter: true
    });
});

app.post('/login', loginUser);
app.post('/register', registerUser);
app.get('/logout',logoutUser);

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { 
            title: 'Profile',
            user: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Error loading profile');
    }
});

app.get('/profile/edit', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.render('profile/edit', { title: 'Edit Profile', user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

app.post('/profile/edit', isLoggedIn, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            errors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
            errors.email = 'This email is already registered';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });
});

// Chat Routes
app.get('/chat', isLoggedIn, (req, res) => {
    res.render('chat', { 
        title: 'Chat',
        user: req.user,
        messages: [] 
    });
});

app.post('/chat/message', isLoggedIn, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        const newMessage = {
            user: req.user.id,
            content: message.trim(),
            timestamp: new Date()
        };

        // Emit the message to all connected clients
        io.emit('chat message', {
            ...newMessage,
            user: {
                id: req.user.id,
                name: req.user.name
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});