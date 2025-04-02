const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader); // Debugging line

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("No or incorrect Authorization header format received.");
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        console.log("Decoded Token:", decoded); // Debugging line
        next();
    } catch (err) {
        console.log("JWT verification failed:", err.message);
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};

module.exports = ensureAuthenticated;
