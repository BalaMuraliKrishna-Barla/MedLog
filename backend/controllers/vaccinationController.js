const Vaccination = require('../models/vaccinationModel');

// @desc    Get all vaccinations for a user (either self or shared)
// @route   GET /api/vaccinations/:userId
// @access  Private
const getVaccinations = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;
        const AccessGrant = require('../models/accessGrantModel'); // Lazy require to avoid circular deps if ever needed

        // Check if the requester is asking for their own records
        if (targetUserId === requesterId) {
            const vaccinations = await Vaccination.find({ user: targetUserId }).sort({ dateAdministered: -1 });
            return res.status(200).json(vaccinations);
        }

        // If not, check if there is an active access grant
        const grant = await AccessGrant.findOne({
            owner: targetUserId,
            grantee: requesterId,
            status: 'active',
        });

        if (!grant) {
            res.status(403); // Forbidden
            throw new Error('You do not have permission to access these records.');
        }

        // If grant exists and is active, fetch the records
        const vaccinations = await Vaccination.find({ user: targetUserId }).sort({ dateAdministered: -1 });
        res.status(200).json(vaccinations);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Add a new vaccination
// @route   POST /api/vaccinations
// @access  Private
const addVaccination = async (req, res) => {
    try {
        const { vaccineName, dateAdministered, administeredBy, dosage } = req.body;

        if (!vaccineName || !dateAdministered) {
            res.status(400);
            throw new Error('Vaccine name and date administered are required.');
        }

        const newVaccination = await Vaccination.create({
            user: req.user.id,
            vaccineName,
            dateAdministered,
            administeredBy,
            dosage,
        });

        res.status(201).json(newVaccination);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update a vaccination record
// @route   PUT /api/vaccinations/:id
// @access  Private
const updateVaccination = async (req, res) => {
    try {
        const vaccination = await Vaccination.findOne({ _id: req.params.id, user: req.user.id });

        if (!vaccination) {
            res.status(404);
            throw new Error('Vaccination record not found or user not authorized');
        }

        const updatedVaccination = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedVaccination);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete a vaccination record
// @route   DELETE /api/vaccinations/:id
// @access  Private
const deleteVaccination = async (req, res) => {
    try {
        const vaccination = await Vaccination.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!vaccination) {
            res.status(404);
            throw new Error('Vaccination record not found or user not authorized');
        }

        res.status(200).json({ id: req.params.id, message: 'Vaccination record removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination,
};