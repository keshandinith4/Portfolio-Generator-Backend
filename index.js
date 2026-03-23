import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import router from './routes/auth_routes.js';
import Portfoliorouter from './routes/portfolio_routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', router);
app.use('/api/portfolio', Portfoliorouter);

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Successfully connected to MongoDB");
    
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Exit process if connection fails
    });