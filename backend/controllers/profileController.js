const Profile = require('../models/profileModel');

// @desc    Get user profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = async (req, res) => {
    try {
        // req.user.id is coming from the authMiddleware
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!profile) {
            res.status(404);
            throw new Error('Profile not found');
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
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            res.status(404);
            throw new Error('Profile not found');
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body }, // Update with the fields passed in the request body
            { new: true } // Return the modified document
        ).populate('user', ['name', 'email']);

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};