const express = require('express');
const router = express.Router();
const { exportPdf, exportJson } = require('../controllers/exportController'); // Import exportJson
const { protect } = require('../middleware/authMiddleware');

router.get('/pdf', protect, exportPdf);
router.get('/json', protect, exportJson); // Add this new route

module.exports = router;