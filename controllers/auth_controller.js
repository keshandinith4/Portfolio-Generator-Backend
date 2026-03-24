import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// check username availability
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.length < 3) {
      return res.status(400).json({ message: "Username too short!" });
    }
    const isValid = /^[a-zA-Z0-9_]+$/.test(username);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid characters in username!" });
    }
    const existing = await User.findOne({ username: username.toLowerCase() });
    res.status(200).json({ available: !existing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const isValidUsername = /^[a-zA-Z0-9]+$/.test(username);
    if (!isValidUsername) {
      return res.status(400).json({ message: "Username can only contain letters and numbers!" });
    }
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken!" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
      hasPortfolio: false,
      portfolioData: {
        fullName: `${firstName} ${lastName}`,
      },
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...userInfo } = savedUser.toObject();
    res.status(201).json({ ...userInfo, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...userInfo } = user.toObject();
    res.status(200).json({ ...userInfo, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update portfolio
const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.user; // comes from auth middleware
    const { portfolioData } = req.body;

    if (!portfolioData || typeof portfolioData !== "object") {
      return res.status(400).json({ message: "Invalid portfolio data!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          portfolioData,
          hasPortfolio: true,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { password: _, ...userInfo } = updatedUser.toObject();
    res.status(200).json({ message: "Portfolio updated successfully!", ...userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete portfolio
const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.user; // comes from auth middleware

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          hasPortfolio: false,
          portfolioData: {}, // reset portfolio data
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Portfolio deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { checkUsername, register, login, logout, updatePortfolio, deletePortfolio };