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

router.route("/:userId").get(getMedications);
router.route("/").post(addMedication);
router.route('/:id').put(updateMedication).delete(deleteMedication);

module.exports = router;