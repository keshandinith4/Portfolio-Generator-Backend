const express = require('express');
const router = express.Router();
const { update_portfolio, get_portfolio } = require('../controllers/portfolio_controller');
const { verifyToken } = require('../middleware/verifyToken'); 

router.put('/update', verifyToken, update_portfolio);

router.get('/:username', get_portfolio);

module.exports = router;