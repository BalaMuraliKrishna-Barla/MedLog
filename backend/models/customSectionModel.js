const mongoose = require('mongoose');

// Sub-document for individual items within a custom section
const customItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the item'],
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const customSectionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a title for the section'],
        },
        icon: { // Storing the Font Awesome icon name
            type: String,
            default: 'fa-notes-medical',
        },
        items: [customItemSchema], // Array of items
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CustomSection', customSectionSchema);