const express = require('express');
const router = express.Router();

// get the controller functions
router.get('/', async (req, res) => {
    try {
        res.json({ message: "Successfully fetched portfolio data" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Placeholder for future portfolio routes
router.post('/add', async (req, res) => {
    try {
        res.status(201).json({ message: "Successfully added new portfolio" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;