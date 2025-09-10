const express = require('express');
const router = express.Router();
const {
    getVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination,
} = require('../controllers/vaccinationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes in this file

router.route("/:userId").get(getVaccinations);
router.route("/").post(addVaccination);
router.route('/:id').put(updateVaccination).delete(deleteVaccination);

module.exports = router;