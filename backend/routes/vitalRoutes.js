const express = require("express");
const router = express.Router();
const {
  getVitals,
  createVital,
  updateVital,
  deleteVital,
} = require("../controllers/vitalController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getVitals).post(createVital);
router.route("/:id").put(updateVital).delete(deleteVital);

module.exports = router;
