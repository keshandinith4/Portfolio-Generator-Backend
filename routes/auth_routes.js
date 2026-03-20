const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    try {
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;