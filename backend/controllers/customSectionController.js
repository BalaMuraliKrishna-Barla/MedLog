const CustomSection = require('../models/customSectionModel');
const AccessGrant = require('../models/accessGrantModel');

// @desc    Get all custom sections for a user
const getCustomSections = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;

        if (targetUserId === requesterId) {
            const sections = await CustomSection.find({ user: targetUserId }).sort({ createdAt: 1 });
            return res.status(200).json(sections);
        }

        const grant = await AccessGrant.findOne({ owner: targetUserId, grantee: requesterId, status: 'active' });
        if (!grant) {
            return res.status(403).json({ message: 'You do not have permission to access these records.' });
        }

        const sections = await CustomSection.find({ user: targetUserId }).sort({ createdAt: 1 });
        res.status(200).json(sections);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Add a new custom section
const addCustomSection = async (req, res) => {
    try {
        const { title, icon } = req.body;
        if (!title) {
            res.status(400);
            throw new Error('Section title is required.');
        }

        const newSection = await CustomSection.create({
            user: req.user.id,
            title,
            icon,
        });
        res.status(201).json(newSection);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete a custom section
const deleteCustomSection = async (req, res) => {
    try {
        const section = await CustomSection.findOneAndDelete({ _id: req.params.sectionId, user: req.user.id });
        if (!section) {
            return res.status(404).json({ message: 'Section not found or user not authorized' });
        }
        res.status(200).json({ id: req.params.sectionId, message: 'Section removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Add an item to a custom section
const addItemToSection = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Item title is required.' });
        }

        const section = await CustomSection.findOne({ _id: req.params.sectionId, user: req.user.id });
        if (!section) {
            return res.status(404).json({ message: 'Section not found or user not authorized' });
        }

        section.items.push({ title, description, date });
        await section.save();
        res.status(201).json(section);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete an item from a custom section
const deleteItemFromSection = async (req, res) => {
    try {
        const { sectionId, itemId } = req.params;
        const section = await CustomSection.findOneAndUpdate(
            { _id: sectionId, user: req.user.id },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        if (!section) {
            return res.status(404).json({ message: 'Section or item not found, or user not authorized' });
        }

        res.status(200).json(section);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};


module.exports = {
    getCustomSections,
    addCustomSection,
    deleteCustomSection,
    addItemToSection,
    deleteItemFromSection,
};