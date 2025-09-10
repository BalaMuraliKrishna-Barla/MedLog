const express = require('express');
const router = express.Router();
const {
    getAllergies,
    addAllergy,
    updateAllergy,
    deleteAllergy,
} = require('../controllers/allergyController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// GET route is now specific to avoid conflicts
router.route('/user/:userId').get(getAllergies);

// POST route is for the current user to create their own record
router.route('/').post(addAllergy);

// Routes for updating/deleting a SPECIFIC record by its ID
router.route('/:id').put(updateAllergy).delete(deleteAllergy);
module.exports = router;