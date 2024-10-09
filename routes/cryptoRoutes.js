const express = require('express');
const { getLatestStats, getStandardDeviation } = require('../controllers/cryptoController');

const router = express.Router();

router.get('/stats', getLatestStats);
router.get('/deviation', getStandardDeviation);

module.exports = router;
