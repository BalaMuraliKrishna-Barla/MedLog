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

router.route('/').get(getVitals).post(addVital);
router.route('/:id').put(updateVital).delete(deleteVital);

module.exports = router;