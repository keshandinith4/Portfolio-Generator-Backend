import express from 'express';
import { createPortfolio, updatePortfolio, getPortfolio, incrementViewCount, deletePortfolio } from '../controllers/portfolio_controller.js';
import { verifyToken } from '../middleware/verify_token.js';

const Portfoliorouter = express.Router();

Portfoliorouter.put('/create/:username', verifyToken, createPortfolio);
Portfoliorouter.put('/update/:username', verifyToken, updatePortfolio);
Portfoliorouter.get('/:username', getPortfolio);
Portfoliorouter.post('/:username/view', incrementViewCount);
Portfoliorouter.delete('/:username', verifyToken, deletePortfolio);

export default Portfoliorouter;