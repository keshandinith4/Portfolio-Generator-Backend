import express from 'express';
import { register, login, logout, checkUsername } from '../controllers/auth_controller.js';

const router = express.Router();

router.get('/check-username', checkUsername); 
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;