const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        recordDate: {
            type: Date,
            required: [true, 'Please add the date of the reading'],
            default: Date.now,
        },
        bloodPressure: {
            type: String, // e.g., "120/80"
        },
        heartRate: {
            type: Number, // Beats per minute
        },
        temperature: {
            type: Number, // e.g., 37.0 (Celsius) or 98.6 (Fahrenheit)
        },
        bloodSugar: {
            type: Number, // e.g., 90 (mg/dL)
        },
        weight: {
            type: Number, // Kilograms or Pounds
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Vital', vitalSchema);
