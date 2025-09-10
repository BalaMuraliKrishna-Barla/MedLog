const express = require('express');
const router = express.Router();
const {
    getMedications,
    addMedication,
    updateMedication,
    deleteMedication,
} = require('../controllers/medicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET route is now specific to avoid conflicts
router.route('/user/:userId').get(getMedications);

// POST route is for the current user to create their own record
router.route('/').post(addMedication);

// Routes for updating/deleting a SPECIFIC record by its ID
router.route('/:id').put(updateMedication).delete(deleteMedication);

module.exports = router;