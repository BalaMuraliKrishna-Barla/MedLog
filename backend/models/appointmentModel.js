const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        doctorName: {
            type: String,
            required: [true, 'Please add a doctor or clinic name'],
        },
        specialty: {
            type: String,
        },
        purpose: {
            type: String,
            required: [true, 'Please add the purpose of the appointment'],
        },
        appointmentDateTime: {
            type: Date,
            required: [true, 'Please add the date and time of the appointment'],
        },
        location: {
            type: String,
        },
        notes: {
            type: String,
        },
        // --- ADD THIS NEW FIELD ---
        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Appointment', appointmentSchema);