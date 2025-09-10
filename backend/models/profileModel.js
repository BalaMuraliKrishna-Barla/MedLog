const mongoose = require('mongoose');

// This is a sub-document schema. It won't have its own model.
const emergencyContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    relationship: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
});

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This creates the critical link to the User model
            unique: true, // Ensures one profile per user
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        },
        bloodType: {
            type: String,
        },
        primaryDoctor: {
            name: { type: String },
            clinic: { type: String },
            phoneNumber: { type: String },
        },
        emergencyContacts: [emergencyContactSchema],
        
        medicationReminderLastSent: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Profile', profileSchema);