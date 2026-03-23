import User from '../models/user.js';

// POST /portfolio/add 
const createPortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found!" });

        if (user.hasPortfolio) {
            return res.status(400).json({ message: "Portfolio already exists! Use update instead." });
        }

        const { fullName, title, bio, profileImage, resumeUrl, contact, skills, projects, experience } = req.body;

        if (!fullName || !title) {
            return res.status(400).json({ message: "Full name and title are required!" });
        }

        user.portfolioData = buildPortfolioData(req.body);
        user.hasPortfolio  = true;
        await user.save();

        const { password, ...userInfo } = user.toObject();
        res.status(201).json({ message: "Portfolio created successfully!", user: userInfo });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /portfolio/update/:username 
const updatePortfolio = async (req, res) => {
    try {
        // Users can only update their own portfolio
        if (req.user.username !== req.params.username) {
            return res.status(403).json({ message: "You can only update your own portfolio!" });
        }

        const { fullName, title } = req.body;
        if (!fullName || !title) {
            return res.status(400).json({ message: "Full name and title are required!" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { portfolioData: buildPortfolioData(req.body), hasPortfolio: true } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: "User not found!" });

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
        const user = await User.findByIdAndUpdate(
            req.user.id,
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