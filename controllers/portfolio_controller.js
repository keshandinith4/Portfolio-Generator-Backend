const User = require('../models/User');

exports.updatePortfolio = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { portfolioData: req.body, hasPortfolio: true } },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: "Success", portfolioData: updatedUser.portfolioData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPortfolio = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('portfolioData');
        if (!user) return res.status(404).json("Portfolio not found");
        res.status(200).json(user.portfolioData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};