const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.authToken; // Assuming you use cookies middleware
    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  //req.user is now available in the next middleware function or route handler
        //req.user is a property that is added to the request object
        next();
    } catch (err) {
        console.error('Invalid token', err);
        res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = authenticateJWT;
