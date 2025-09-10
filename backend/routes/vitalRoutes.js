const express = require('express');
const router = express.Router();
const {
    getVitals,
    addVital,
    updateVital,
    deleteVital,
} = require('../controllers/vitalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET route is now specific to avoid conflicts
router.route('/user/:userId').get(getVitals);

// POST route is for the current user to create their own record
router.route('/').post(addVital);

// Routes for updating/deleting a SPECIFIC record by its ID
router.route('/:id').put(updateVital).delete(deleteVital); 

module.exports = router;
