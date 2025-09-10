const express = require('express');
const router = express.Router();
const {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getAppointments).post(addAppointment);
router.route('/:id').put(updateAppointment).delete(deleteAppointment);

module.exports = router;