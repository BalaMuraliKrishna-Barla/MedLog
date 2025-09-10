const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');

// WITH this new version
const registerUser = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, role } = req.body;

        // 1. Validation
        if (!name || !email || !password || !dateOfBirth || !role) {
            res.status(400);
            throw new Error('Please include all fields: name, email, password, date of birth, and role.');
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
            dateOfBirth,
            role,
        });

        // 5. Create an associated profile.
        if (user) {
            try {
                // Pass the date of birth to the profile upon creation
                await Profile.create({ user: user._id, dateOfBirth: user.dateOfBirth }); 

                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role, // Return the role
                    token: generateToken(user._id),
                });
            } catch (profileError) {
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
  registerUser,
  loginUser,
  getMe,
  getUserById,
};