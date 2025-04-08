// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Ensure JWT_SECRET is loaded

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // console.log("Auth Header Received:", authHeader); // Keep for debugging if needed

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log("Middleware: No or incorrect Authorization header format.");
        return res.status(401).json({ message: 'Unauthorized: Access token is missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded payload (which includes _id, email, role) to the request object
        req.user = decoded;
        // console.log("Middleware: Decoded Token Payload:", decoded); // Keep for debugging if needed
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Middleware: JWT verification failed:", err.message);
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token has expired.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }
        // Generic fallback
        return res.status(401).json({ message: 'Unauthorized: Token verification failed.' });
    }
};

// Middleware to check if the authenticated user is an admin
const isAdmin = (req, res, next) => {
    // This middleware assumes ensureAuthenticated has already run and populated req.user
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed
    } else {
        // User is either not authenticated correctly or not an admin
        return res.status(403).json({ message: 'Forbidden: Access restricted to administrators.' });
    }
};

module.exports = {
    ensureAuthenticated,
    isAdmin
};