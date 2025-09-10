const Profile = require('../models/profileModel');
const User = require("../models/userModel");
// @desc    Get user profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = async (req, res) => {
    try {
        // req.user.id is coming from the authMiddleware
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['_id', 'name', 'email', 'dateOfBirth', 'role']); // FIX: Added all necessary fields

        if (!profile) {
            // If no profile exists, create one for the user.
            const user = await User.findById(req.user.id);
            const newProfile = await Profile.create({ 
                user: user._id, 
                dateOfBirth: user.dateOfBirth 
            });
            const populatedProfile = await newProfile.populate('user', ['_id', 'name', 'email', 'dateOfBirth', 'role']);
            return res.status(200).json(populatedProfile);
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};
// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, dateOfBirth, ...profileData } = req.body;

        // 1. Update User model fields if they exist
        const userUpdate = {};
        if (name) userUpdate.name = name;
        if (dateOfBirth) userUpdate.dateOfBirth = dateOfBirth;

        // Use findByIdAndUpdate for atomicity and to get the updated document
        const updatedUser = await User.findByIdAndUpdate(userId, userUpdate, { new: true }).select('-password');

        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }

        // 2. Update Profile model fields
        // Also sync dateOfBirth from the user model to the profile model
        profileData.dateOfBirth = updatedUser.dateOfBirth; 
        const updatedProfile = await Profile.findOneAndUpdate({ user: userId }, { $set: profileData }, { new: true });
        
        if (!updatedProfile) {
            res.status(404);
            throw new Error('Profile not found');
        }

        // 3. Construct the final response object, embedding the updated user data.
        // We use .toObject() to get a plain JS object, then manually attach the user.
        const responseProfile = updatedProfile.toObject();
        responseProfile.user = updatedUser.toObject();

        res.status(200).json(responseProfile);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};