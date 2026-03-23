import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied! No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const message = err.name === 'TokenExpiredError' ? "Session expired!" : "Invalid token!";
            return res.status(403).json({ message });
        }
        req.user = decoded; 
        next();
    });
};

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        // Only allow if the logged-in user matches the username in params OR is an admin
        if (req.user.username === req.params.username || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "You are not authorized to edit this portfolio!" });
        }
    });
};