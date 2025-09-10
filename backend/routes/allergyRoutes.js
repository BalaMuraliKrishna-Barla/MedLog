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
router.route('/:userId').get(getAllergies); // For getting records
router.route('/').post(addAllergy); // For creating a new record for self
router.route('/:id').put(updateAllergy).delete(deleteAllergy);

module.exports = router;