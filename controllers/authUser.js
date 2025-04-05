import bcrypt from 'bcrypt';
import userModel from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async function(req, res) {
    try {
        const { name, email, password,phone,location} = req.body;
        const user = await userModel.findOne({email});
        if(user){
            return res.status(400).json({
                error: "User Already Exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await userModel.create({
            name, email, password: hashedPassword, phone, location
        });
        const token = generateToken(newUser._id);
        res.cookie('token', token);
        console.log('registration successful');
        res.redirect('/');  
    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            error: "An Error Occurred During Registration"
        });
    }
}   

export const loginUser = async function(req, res) {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide both email and password'
            });
        }
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }
        const token = generateToken(user._id);
        res.cookie('token', token);
        console.log('login successful');
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
}

export const logoutUser = async function(req, res) {
    try {
        res.cookie('token', '');
        return res.redirect('/login');
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            error: "An Error Occurred During Logout"
        });
    }
}