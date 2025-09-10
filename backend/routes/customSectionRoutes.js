const express = require('express');
const router = express.Router();
const {
    getCustomSections,
    addCustomSection,
    deleteCustomSection,
    addItemToSection,
    deleteItemFromSection,
} = require('../controllers/customSectionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Routes for entire sections
router.route('/user/:userId').get(getCustomSections);
router.route('/').post(addCustomSection);
router.route('/:sectionId').delete(deleteCustomSection);

// Routes for items within a section
router.route('/:sectionId/items').post(addItemToSection);
router.route('/:sectionId/items/:itemId').delete(deleteItemFromSection);

module.exports = router;