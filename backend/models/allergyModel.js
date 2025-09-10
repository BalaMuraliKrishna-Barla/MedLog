const mongoose = require('mongoose');

const allergySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Link to the User model
        },
        allergen: {
            type: String,
            required: [true, 'Please specify the allergen'],
        },
        reaction: {
            type: String,
            default: 'N/A', // A default value if no reaction is specified
        },
        severity: {
            type: String,
            required: [true, 'Please specify the severity'],
            enum: ['Mild', 'Moderate', 'Severe', 'Unknown'], // Enforces a choice from these options
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Allergy', allergySchema);