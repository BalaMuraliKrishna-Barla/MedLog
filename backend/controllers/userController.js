const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please include all fields');
        }

        // 2. Find if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // 5. Create an associated profile. If this fails, we must delete the user.
        if (user) {
            try {
                await Profile.create({ user: user._id }); // Link profile to user

                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id),
                });
            } catch (profileError) {
                // If profile creation fails, roll back user creation for data integrity
                await User.findByIdAndDelete(user._id);
                console.error(profileError);
                res.status(500);
                throw new Error('User registration failed, could not create profile.');
            }
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};


// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    // The user is available from req.user because of our protect middleware
    res.status(200).json(req.user);
};


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for user email
        const user = await User.findOne({ email });

        // 2. Check password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getMe,
};