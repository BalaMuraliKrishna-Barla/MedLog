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

// GET route is now more specific to avoid conflicts with '/:id'
router.route("/user/:userId").get(getAppointments);

// POST route is for the user to create their OWN appointment
router.route("/").post(addAppointment);

// Routes for updating/deleting a SPECIFIC appointment by its ID
router.route("/:id").put(updateAppointment).delete(deleteAppointment);

module.exports = router;
