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

// GET route is now specific to avoid conflicts
router.route('/user/:userId').get(getVaccinations);

// POST route is for the current user to create their own record
router.route('/').post(addVaccination);

// Routes for updating/deleting a SPECIFIC record by its ID
router.route('/:id').put(updateVaccination).delete(deleteVaccination);


module.exports = router;