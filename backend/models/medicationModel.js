const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        medicationName: {
            type: String,
            required: [true, 'Please add the medication name'],
        },
        dosage: {
            type: String,
            required: [true, 'Please add the dosage'],
        },
        frequency: {
            type: String,
            required: [true, 'Please add the frequency'],
        },
        reason: {
            type: String, // e.g., "High Blood Pressure"
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date, // Can be null if the medication is ongoing
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Medication', medicationSchema);