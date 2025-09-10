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

// Chain routes for the same path
router.route('/').get(getAllergies).post(addAllergy);
router.route('/:id').put(updateAllergy).delete(deleteAllergy);

module.exports = router;