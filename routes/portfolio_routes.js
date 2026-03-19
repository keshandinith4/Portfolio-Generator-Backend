const express = require('express');
const router = express.Router();
const { updatePortfolio, getPortfolio } = require('../controllers/portfolioController');
const { verifyToken } = require('../middleware/verifyToken'); 

router.put('/update', verifyToken, updatePortfolio);

router.get('/:username', getPortfolio);

module.exports = router;