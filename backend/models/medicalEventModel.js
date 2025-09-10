const mongoose = require('mongoose');

const medicalEventSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        eventType: {
            type: String,
            required: [true, 'Please specify the event type'],
            enum: ['Surgery', 'Diagnosis', 'Hospitalization', 'Treatment', 'Other'],
        },
        title: {
            type: String,
            required: [true, 'Please add a title for the event'],
        },
        date: {
            type: Date,
            required: [true, 'Please add the date of the event'],
        },
        description: {
            type: String,
        },
        doctorInvolved: {
            type: String,
        },
        location: { // e.g., Hospital or Clinic name
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('MedicalEvent', medicalEventSchema);