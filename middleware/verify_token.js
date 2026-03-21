const jwt = require('jsonwebtoken');

// check if the request has a valid token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.token;
    
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token is not valid!");
            
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.username === req.params.username || req.user.id) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization 
};