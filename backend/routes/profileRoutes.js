const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Since both routes point to '/me', we can chain them.
// Both routes are protected by the 'protect' middleware.
router.route('/me').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;