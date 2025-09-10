const Medication = require('../models/medicationModel');

// @desc    Get all medications for a user (either self or shared)
// @route   GET /api/medications/:userId
// @access  Private
const getMedications = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;
        const AccessGrant = require('../models/accessGrantModel');

        if (targetUserId === requesterId) {
            const medications = await Medication.find({ user: targetUserId }).sort({ startDate: -1 });
            return res.status(200).json(medications);
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

        const medications = await Medication.find({ user: targetUserId }).sort({ startDate: -1 });
        res.status(200).json(medications);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

const addMedication = async (req, res) => {
    try {
        const { medicationName, dosage, frequency, instructions, reason, startDate, endDate } = req.body;

        if (!medicationName || !dosage || !frequency || !frequency.timesPerDay) {
            res.status(400);
            throw new Error('Medication name, dosage, and frequency details are required.');
        }

        const newMedication = await Medication.create({
            user: req.user.id,
            medicationName,
            dosage,
            frequency,
            instructions,
            reason,
            startDate,
            endDate,
        });

        res.status(201).json(newMedication);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

const updateMedication = async (req, res) => {
    try {
        const { medicationName, dosage, frequency, instructions, reason, startDate, endDate } = req.body;

        // Add validation for the updated data
        if (!medicationName || !dosage || !frequency || !frequency.timesPerDay) {
            res.status(400);
            throw new Error('Medication name, dosage, and frequency details are required.');
        }
        
        const medication = await Medication.findOne({ _id: req.params.id, user: req.user.id });

        if (!medication) {
            res.status(404);
            throw new Error('Medication record not found or user not authorized');
        }

        const updatedMedication = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json(updatedMedication);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete a medication record
// @route   DELETE /api/medications/:id
// @access  Private
const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!medication) {
            res.status(404);
            throw new Error('Medication record not found or user not authorized');
        }

        res.status(200).json({ id: req.params.id, message: 'Medication record removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getMedications,
    addMedication,
    updateMedication,
    deleteMedication,
};
