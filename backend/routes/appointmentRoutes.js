const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

// All these routes are protected and require a valid token
router.use(protect);

router.route("/").get(getAppointments).post(createAppointment);
router.route("/:id").put(updateAppointment).delete(deleteAppointment);

module.exports = router;
