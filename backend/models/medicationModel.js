const mongoose = require('mongoose');

// WITH this new version
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
        // Frequency is now a structured object
        frequency: {
            timesPerDay: {
                type: Number,
                required: true,
            },
            // Stores specific times like ['Morning', 'Evening']
            timings: [
                {
                    type: String,
                    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
                },
            ],
        },
        instructions: {
            type: String,
            enum: ['Any Time', 'Before Food', 'After Food'],
            default: 'Any Time',
        },
        reason: {
            type: String, 
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('Medication', medicationSchema);