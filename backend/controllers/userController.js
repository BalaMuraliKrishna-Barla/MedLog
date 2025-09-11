const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Otp = require("../models/otpModel");
const { sendOtpEmail } = require("../services/notificationService");

// @desc    Send OTP for registration
// @route   POST /api/users/send-otp
// @access  Public
const sendRegistrationOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400);
            throw new Error('Please provide an email.');
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('An account with this email already exists.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.deleteMany({ email });
        await Otp.create({ email, otp });
        sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Verify OTP and Register a new user
// @route   POST /api/users/verify-register
// @access  Public
const verifyOtpAndRegisterUser = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, role, otp } = req.body;
        if (!name || !email || !password || !dateOfBirth || !role || !otp) {
            res.status(400);
            throw new Error('Please include all fields, including the OTP.');
        }
        const storedOtp = await Otp.findOne({ email });
        if (!storedOtp) {
            res.status(400);
            throw new Error('OTP is invalid or has expired. Please try again.');
        }
        const isMatch = await bcrypt.compare(otp, storedOtp.otp);
        if (!isMatch) {
            res.status(400);
            throw new Error('The OTP you entered is incorrect.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword, dateOfBirth, role });
        if (user) {
            await Profile.create({ user: user._id, dateOfBirth: user.dateOfBirth });
            await Otp.deleteMany({ email });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data during user creation.');
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

// @desc    Get user data by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

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
                role: user.role, // Return the role on login
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
  sendRegistrationOtp,
  verifyOtpAndRegisterUser,
  loginUser,
  getMe,
  getUserById,
};