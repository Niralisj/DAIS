const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user'); // Adjust path if needed
require('dotenv').config({ path: '../.env' }); // Ensure secrets are loaded

// Function to generate access token (includes role)
function generateAccessToken(user) { // user should be an object { email, _id, role }
    const payload = {
        email: user.email,
        _id: user._id,
        role: user.role // Include role in the payload
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Consider slightly longer expiry? 15m is short.
}

function generateRefreshToken(user) { 
     const payload = {
        email: user.email,
        _id: user._id,
        role: user.role // Consistent to include role here too
    };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered. Please login.', success: false });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        // Create and save new user (role defaults to 'user' based on schema)
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: "Signup successful!",
            success: true
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal Server Error during signup.",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Invalid email or password.'; // Keep error messages generic

        if (!user) {
            return res.status(401).json({ message: errorMsg, success: false });
        }

        // Compare submitted password with stored hash
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(401).json({ message: errorMsg, success: false });
        }

        // Ensure user object has role (should be guaranteed by schema default)
         if (!user.role) {
             console.error(`User role missing for ${email} (ID: ${user._id})`);
             return res.status(500).json({ message: 'Internal server error: User data incomplete.' });
         }

        // Generate tokens
        const userPayloadForToken = { email: user.email, _id: user._id, role: user.role };
        const accessToken = generateAccessToken(userPayloadForToken);
        const refreshToken = generateRefreshToken(userPayloadForToken);

        // TODO: Securely store refresh token (e.g., in DB associated with user, httpOnly cookie)
        // Storing in memory (app.locals) is NOT suitable for production or scaling.
        // For now, just sending it back. Frontend needs to store it securely.
        // req.app.locals.refreshTokens = req.app.locals.refreshTokens || {};
        // req.app.locals.refreshTokens[refreshToken] = userPayloadForToken;

        // Send response
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken: accessToken,
            refreshToken: refreshToken, // Send refresh token
            // Send necessary user data for frontend context
            userData: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal server error during login.",
            success: false
        });
    }
};

// Get current user's profile (requires authentication)
const me = async (req, res) => {
    // ensureAuthenticated middleware should have run and populated req.user
    if (!req.user || !req.user._id) {
         return res.status(401).json({ message: 'Unauthorized: User data not found in request.' });
    }

    try {
        // Fetch fresh user data from DB to ensure it's up-to-date
        // Exclude the password field
        const user = await UserModel.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Set headers to prevent caching of this sensitive endpoint
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Return user profile data
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            // Include other non-sensitive fields if needed
        });

    } catch (error) {
        console.error('Error fetching user profile (/me):', error);
        res.status(500).json({ message: 'Internal server error fetching user profile.' });
    }
};


// Refresh access token using refresh token
const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required.' });
    }

    // TODO: Proper Refresh Token Validation (lookup in DB, check if revoked etc.)
    // The in-memory storage used previously is not implemented here for simplicity.
    // This basic version just verifies the token signature and expiry.
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // We have a valid refresh token, issue a new access token
         // Ensure payload has needed info (_id, email, role from decoded token)
         if (!decoded._id || !decoded.email || !decoded.role) {
            return res.status(403).json({ message: 'Invalid refresh token payload.' });
         }

        const userPayloadForToken = { email: decoded.email, _id: decoded._id, role: decoded.role };
        const newAccessToken = generateAccessToken(userPayloadForToken);

        res.status(200).json({ accessToken: newAccessToken });

    } catch (err) {
         console.error("Refresh token error:", err.message);
         // Handle specific errors
         if (err.name === 'TokenExpiredError') {
             return res.status(403).json({ message: 'Forbidden: Refresh token has expired.' });
         }
         if (err.name === 'JsonWebTokenError') {
             return res.status(403).json({ message: 'Forbidden: Invalid refresh token.' });
         }
        return res.status(403).json({ message: 'Forbidden: Refresh token validation failed.' });
    }
};


module.exports = {
    signup,
    login,
    me,
    refresh
};