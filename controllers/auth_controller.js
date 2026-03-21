import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        
        res.status(201).json({ message: "User registered successfully!", userId: savedUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: "User not found!" });

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials!" });

        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // check the user's portfolio status
        const userPortfolio = await User.findOne({ username: user.username });

        const { password, ...info } = user._doc;
        
        res.status(200).json({ 
            ...info, 
            token, 
            hasPortfolio: !!userPortfolio,
            portfolioData: userPortfolio 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { register, login };