import User from '../models/user.js';

// Update or Create Portfolio
const updatePortfolio = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { 
                $set: { 
                    portfolioData: req.body, 
                    hasPortfolio: true 
                } 
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Portfolio updated successfully!", 
            portfolioData: updatedUser.portfolioData 
        });
    } catch (err) {
        // Validation errors
        res.status(500).json({ error: err.message });
    }
};

// Get Portfolio by Username
const getPortfolio = async (req, res) => {
    try {
        // search by username and return portfolioData
        const user = await User.findOne({ username: req.params.username })
            .select('portfolioData fullName username'); 

        if (!user || !user.portfolioData) {
            return res.status(404).json({ message: "Portfolio not found!" });
        }

        res.status(200).json({
            message: "Portfolio fetched successfully!",
            portfolioData: user.portfolioData,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Portfolio
const deletePortfolio = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $set: { hasPortfolio: false },
            $unset: { portfolioData: "" }
        });
        res.status(200).json({ message: "Portfolio deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { updatePortfolio, getPortfolio, deletePortfolio };