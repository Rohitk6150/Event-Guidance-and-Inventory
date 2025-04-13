// const asyncHandler = require('express-async-handler');
// const User = require('../modals/User');
// const generateToken = require('../utils/generateToken'); // You'll need this

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//     const { username, email, password } = req.body;

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//         res.status(400);
//         throw new Error('User with this email already exists');
//     }

//     const user = await User.create({
//         username,
//         email,
//         password,
//     });

//     if (user) {
//         res.status(201).json({
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             token: generateToken(user._id),
//         });
//     } else {
//         res.status(400);
//         throw new Error('Invalid user data');
//     }
// });

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//         res.json({
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             token: generateToken(user._id),
//         });
//     } else {
//         res.status(401);
//         throw new Error('Invalid email or password');
//     }
// });

// module.exports = { registerUser, loginUser };

const asyncHandler = require('express-async-handler');
const User = require('../modals/User');
const generateToken = require('../utils/generateToken'); // You'll need this

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    console.log('Register endpoint hit');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        console.log('Missing required fields');
        res.status(400);
        throw new Error('Please provide all required fields: username, email, password');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        console.log('User already exists with email:', email);
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
            console.log('User created successfully:', user._id);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            console.log('Failed to create user');
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = { registerUser, loginUser };