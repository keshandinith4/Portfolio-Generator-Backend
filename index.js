const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth_routes');
const portfolioRoutes = require('./routes/portfolio_routes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// connect API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Database connection 
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Successfully connected to MongoDB");
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err.message);
    });