const express = require("express");
const router = express.Router();
const {
  getVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} = require("../controllers/vaccinationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getVaccinations).post(createVaccination);
router.route("/:id").put(updateVaccination).delete(deleteVaccination);

module.exports = router;
