import User from '../models/user.js';

// POST /portfolio/add 
const createPortfolio = async (req, res) => {
    try {
        const username = req.params.username;

        if (req.user.username !== username) {
            return res.status(403).json({ message: "You can only create your own portfolio!" });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found!" });

        if (user.hasPortfolio) {
            return res.status(400).json({ message: "Portfolio already exists!" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { portfolioData: buildPortfolioData(req.body), hasPortfolio: true } },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Portfolio created successfully!", user: updatedUser });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// PUT /portfolio/update/:username 
const updatePortfolio = async (req, res) => {
    try {
        const username = req.params.username;

        if (req.user.username !== username) {
            return res.status(403).json({ message: "You can only update your own portfolio!" });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found!" });

        if (!user.hasPortfolio) {
            return res.status(400).json({ message: "Portfolio does not exist! Create one first." });
        }

        const { fullName, title } = req.body;
        if (!fullName || !title) {
            return res.status(400).json({ message: "Full name and title are required!" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { portfolioData: buildPortfolioData(req.body) } },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Portfolio updated successfully!", user: updatedUser });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /portfolio/:username
const getPortfolio = async (req, res) => {
    try {
        const user = await User.findOne({
            username:     req.params.username,
            hasPortfolio: true              // won't return deleted portfolios
        }).select('-password');

        if (!user) return res.status(404).json({ message: "Portfolio not found!" });

        res.status(200).json(user);         // includes viewCount + all portfolioData

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// portfolio/:username/view 
const incrementViewCount = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username, hasPortfolio: true },
            { $inc: { viewCount: 1 } },  
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: "Portfolio not found!" });

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete portfolio
const deletePortfolio = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate( 
            { username: req.user.username },       
            {
                $set:   { hasPortfolio: false },
                $unset: { portfolioData: ""   }
            },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: "User not found!" });

        res.status(200).json({ message: "Portfolio deleted successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const buildPortfolioData = ({ 
    fullName, title, bio, profileImage, resumeUrl,
    contact, skills, projects, experience 
}) => ({
    fullName:     fullName     || '',
    title:        title        || '',
    bio:          bio          || '',
    profileImage: profileImage || '',
    resumeUrl:    resumeUrl    || '',
    contact: {
        email:    contact?.email    || '',
        linkedin: contact?.linkedin || '',
        github:   contact?.github   || '',
        website:  contact?.website  || '',
    },
    skills:     Array.isArray(skills)     ? skills.filter(Boolean)            : [],
    projects:   Array.isArray(projects)   ? projects.filter(p => p.name)      : [],
    experience: Array.isArray(experience) ? experience.filter(e => e.company) : [],
});

export { createPortfolio, updatePortfolio, getPortfolio, incrementViewCount, deletePortfolio };