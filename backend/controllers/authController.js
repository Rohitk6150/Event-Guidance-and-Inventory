const asyncHandler = require('express-async-handler');
const User = require('../modals/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    console.log('Register endpoint hit');
    console.log('Request body:', req.body);
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please provide all required fields: username, email, password');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    try {
        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500);
        throw new Error(`Server error: ${error.message}`);
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    console.log('Login endpoint hit');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
    });
});

module.exports = { registerUser, loginUser };