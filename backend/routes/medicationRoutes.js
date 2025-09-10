const express = require("express");
const router = express.Router();
const {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} = require("../controllers/medicationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getMedications).post(createMedication);
router.route("/:id").put(updateMedication).delete(deleteMedication);

module.exports = router;