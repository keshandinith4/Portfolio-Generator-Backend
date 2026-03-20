const router = require('express').Router();
const { updatePortfolio, getPortfolio } = require('../controllers/portfolio_controller');
const { verifyToken } = require('../middleware/verify_token');

router.put('/update', verifyToken, updatePortfolio);
router.get('/:username', getPortfolio);

module.exports = router;