const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reportController');

// GET farmer totals report
router.get('/farmer-totals', reportController.getFarmerTotals);
router.get('/centre-totals', reportController.getCentreTotals);
module.exports = router;