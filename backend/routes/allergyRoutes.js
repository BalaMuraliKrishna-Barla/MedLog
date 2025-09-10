const express = require("express");
const router = express.Router();
const {
  getAllergies,
  createAllergy,
  updateAllergy,
  deleteAllergy,
} = require("../controllers/allergyController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Routes for getting all and creating a new allergy
router.route("/").get(getAllergies).post(createAllergy);

// Routes for updating and deleting a specific allergy
router.route("/:id").put(updateAllergy).delete(deleteAllergy);

module.exports = router;
