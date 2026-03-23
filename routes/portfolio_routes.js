import express from 'express';
import { createPortfolio, updatePortfolio, getPortfolio, incrementViewCount, deletePortfolio } from '../controllers/portfolio_controller.js';

const Portfoliorouter = express.Router();

Portfoliorouter.post('/create', createPortfolio);
Portfoliorouter.put('/:username', updatePortfolio);
Portfoliorouter.get('/:username', getPortfolio);
Portfoliorouter.post('/:username/view', incrementViewCount);
Portfoliorouter.delete('/:username', deletePortfolio);

export default Portfoliorouter;