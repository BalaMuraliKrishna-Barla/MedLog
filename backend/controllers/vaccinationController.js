const Vaccination = require('../models/vaccinationModel');

// @desc    Get all vaccinations for a user
// @route   GET /api/vaccinations
// @access  Private
const getVaccinations = async (req, res) => {
    try {
        const vaccinations = await Vaccination.find({ user: req.user.id }).sort({ dateAdministered: -1 });
        res.status(200).json(vaccinations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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