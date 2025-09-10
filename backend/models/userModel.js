const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Please add your date of birth'],
        },
        role: {
            type: String,
            required: [true, 'Please specify a role'],
            enum: ['Patient', 'Doctor'],
            default: 'Patient',
        },
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('User', userSchema);