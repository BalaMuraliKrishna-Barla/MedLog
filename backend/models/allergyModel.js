// REPLACE the entire frontend/models/allergyModel.js file

const mongoose = require('mongoose');

const allergySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        allergen: {
            type: String,
            required: [true, 'Please specify the allergen'],
        },
        allergyType: {
            type: String,
            required: [true, 'Please specify the allergy type'],
            enum: ['Food', 'Drug', 'Environmental', 'Insect', 'Other'],
            default: 'Other',
        },
        reaction: {
            type: String,
            default: 'N/A',
        },
        severity: {
            type: String,
            required: [true, 'Please specify the severity'],
            enum: ['Mild', 'Moderate', 'Severe', 'Unknown'],
        },
        firstNoted: {
            type: Date,
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
