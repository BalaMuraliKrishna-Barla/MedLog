const Allergy = require('../models/allergyModel');
const AccessGrant = require("../models/accessGrantModel");
// @desc    Get all allergies for a user (either self or shared)
// @route   GET /api/allergies/:userId
// @access  Private
const getAllergies = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;

        // Check if the requester is asking for their own records
        if (targetUserId === requesterId) {
            const allergies = await Allergy.find({ user: targetUserId }).sort({ createdAt: -1 });
            return res.status(200).json(allergies);
        }

        // If not, check if there is an active access grant
        const grant = await AccessGrant.findOne({
            owner: targetUserId,
            grantee: requesterId,
            status: 'active',
        });

        if (!grant) {
            res.status(403); // Use 403 Forbidden for valid user but no permission
            throw new Error('You do not have permission to access these records.');
        }

        // If grant exists and is active, fetch the records
        const allergies = await Allergy.find({ user: targetUserId }).sort({ createdAt: -1 });
        res.status(200).json(allergies);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

const addAllergy = async (req, res) => {
    try {
        const { allergen, allergyType, reaction, severity, firstNoted, notes } = req.body;

        if (!allergen || !severity || !allergyType) {
            res.status(400);
            throw new Error('Allergen, severity, and allergy type are required fields.');
        }

        const newAllergy = await Allergy.create({
            user: req.user.id,
            allergen,
            allergyType,
            reaction,
            severity,
            firstNoted,
            notes,
        });

        res.status(201).json(newAllergy);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update an allergy
// @route   PUT /api/allergies/:id
// @access  Private
const updateAllergy = async (req, res) => {
    try {
        const allergy = await Allergy.findById(req.params.id);

        if (!allergy) {
            res.status(404);
            throw new Error('Allergy record not found');
        }

        // Security check: Ensure the allergy belongs to the logged-in user
        if (allergy.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedAllergy = await Allergy.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
        });

        res.status(200).json(updatedAllergy);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete an allergy
// @route   DELETE /api/allergies/:id
// @access  Private
const deleteAllergy = async (req, res) => {
    try {
        // We combine finding the document and checking ownership into one atomic query.
        // This is more efficient and secure.
        const allergy = await Allergy.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        // If findOneAndDelete returns null, it means the record was not found OR
        // the user was not the owner.
        if (!allergy) {
            res.status(404);
            throw new Error('Allergy record not found or user not authorized');
        }

        res.status(200).json({ id: req.params.id, message: 'Allergy record removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getAllergies,
    addAllergy,
    updateAllergy,
    deleteAllergy,
};
