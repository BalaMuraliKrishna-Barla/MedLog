const MedicalEvent = require('../models/medicalEventModel');

// @desc    Get all medical events for a user (either self or shared)
// @route   GET /api/medicalevents/:userId
// @access  Private
const getMedicalEvents = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;
        const AccessGrant = require('../models/accessGrantModel');

        if (targetUserId === requesterId) {
            const events = await MedicalEvent.find({ user: targetUserId }).sort({ date: -1 });
            return res.status(200).json(events);
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

        const events = await MedicalEvent.find({ user: targetUserId }).sort({ date: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Add a new medical event
// @route   POST /api/medicalevents
// @access  Private
const addMedicalEvent = async (req, res) => {
    try {
        const { eventType, title, date, description, doctorInvolved, location } = req.body;

        if (!eventType || !title || !date) {
            res.status(400);
            throw new Error('Event type, title, and date are required.');
        }

        const newEvent = await MedicalEvent.create({
            user: req.user.id,
            eventType,
            title,
            date,
            description,
            doctorInvolved,
            location,
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update a medical event
// @route   PUT /api/medicalevents/:id
// @access  Private
const updateMedicalEvent = async (req, res) => {
    try {
        const event = await MedicalEvent.findOne({ _id: req.params.id, user: req.user.id });

        if (!event) {
            res.status(404);
            throw new Error('Medical event not found or user not authorized');
        }

        const updatedEvent = await MedicalEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete a medical event
// @route   DELETE /api/medicalevents/:id
// @access  Private
const deleteMedicalEvent = async (req, res) => {
    try {
        const event = await MedicalEvent.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!event) {
            res.status(404);
            throw new Error('Medical event not found or user not authorized');
        }

        res.status(200).json({ id: req.params.id, message: 'Medical event removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getMedicalEvents,
    addMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent,
};
