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

router.route("/:userId").get(getMedicalEvents);
router.route("/").post(addMedicalEvent);
router.route('/:id').put(updateMedicalEvent).delete(deleteMedicalEvent);

module.exports = router;