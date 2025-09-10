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

router.route('/').get(getMedications).post(addMedication);
router.route('/:id').put(updateMedication).delete(deleteMedication);

module.exports = router;