import express from 'express';
import { getPortfolio } from '../controllers/portfolio_controller.js';
const router = express.Router();

// get the controller functions
router.get('/:username', getPortfolio);

// Placeholder for future portfolio routes
router.post('/add', async (req, res) => {
    try {
        res.status(201).json({ message: "Successfully added new portfolio" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;