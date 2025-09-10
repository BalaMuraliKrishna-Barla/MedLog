const express = require('express');
const router = express.Router();
const {
    getMedicalEvents,
    addMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent,
} = require('../controllers/medicalEventController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET route is now specific to avoid conflicts
router.route('/user/:userId').get(getMedicalEvents);

// POST route is for the current user to create their own record
router.route('/').post(addMedicalEvent);

// Routes for updating/deleting a SPECIFIC record by its ID
router.route('/:id').put(updateMedicalEvent).delete(deleteMedicalEvent);

module.exports = router;
