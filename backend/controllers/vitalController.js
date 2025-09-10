const Vital = require('../models/vitalModel');
// @desc    Get all vitals for a user (either self or shared)
// @route   GET /api/vitals/:userId
// @access  Private
const getVitals = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;
        const AccessGrant = require('../models/accessGrantModel');

        if (targetUserId === requesterId) {
            const vitals = await Vital.find({ user: targetUserId }).sort({ recordDate: -1 });
            return res.status(200).json(vitals);
        }

        const grant = await AccessGrant.findOne({
            owner: targetUserId,
            grantee: requesterId,
            status: 'active',
        });

        if (!grant) {
            res.status(403);
            throw new Error('You do not have permission to access these records.');
        }

        const vitals = await Vital.find({ user: targetUserId }).sort({ recordDate: -1 });
        res.status(200).json(vitals);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};


// @desc    Add a new vital record
// @route   POST /api/vitals
// @access  Private
const addVital = async (req, res) => {
    try {
        const { recordDate, bloodPressure, heartRate, temperature, bloodSugar, weight, notes } = req.body;

        const newVital = await Vital.create({
            user: req.user.id,
            recordDate,
            bloodPressure,
            heartRate,
            temperature,
            bloodSugar,
            weight,
            notes,
        });

        res.status(201).json(newVital);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update a vital record
// @route   PUT /api/vitals/:id
// @access  Private
const updateVital = async (req, res) => {
    try {
        const vital = await Vital.findOne({ _id: req.params.id, user: req.user.id });

        if (!vital) {
            res.status(404);
            throw new Error('Vital record not found or user not authorized');
        }

        const updatedVital = await Vital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedVital);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete a vital record
// @route   DELETE /api/vitals/:id
// @access  Private
const deleteVital = async (req, res) => {
    try {
        const vital = await Vital.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!vital) {
            res.status(404);
            throw new Error('Vital record not found or user not authorized');
        }

        res.status(200).json({ id: req.params.id, message: 'Vital record removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getVitals,
    addVital,
    updateVital,
    deleteVital,
};
