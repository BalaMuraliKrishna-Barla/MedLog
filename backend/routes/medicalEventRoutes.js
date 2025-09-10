const express = require("express");
const router = express.Router();
const {
  getMedicalEvents,
  createMedicalEvent,
  updateMedicalEvent,
  deleteMedicalEvent,
} = require("../controllers/medicalEventController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getMedicalEvents).post(createMedicalEvent);
router.route("/:id").put(updateMedicalEvent).delete(deleteMedicalEvent);

module.exports = router;
