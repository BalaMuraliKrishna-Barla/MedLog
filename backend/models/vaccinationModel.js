const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        vaccineName: {
            type: String,
            required: [true, 'Please add the vaccine name'],
        },
        dateAdministered: {
            type: Date,
            required: [true, 'Please add the date of administration'],
        },
        administeredBy: {
            type: String, // e.g., Doctor's name or clinic name
        },
        dosage: {
            type: String, // e.g., "1st Dose", "Booster"
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Vaccination', vaccinationSchema);