// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' }); // Load .env from parent directory

// Initialize Express app
const app = express();

// --- Database Connection ---
// Ensure DB connection is established before starting the server fully
// The require statement executes the connection logic in db.js
require('./models/db');

// --- Middleware ---
// Enable CORS for all origins (adjust in production for security)
app.use(cors());

// Body parsing middleware (handles JSON request bodies)
app.use(express.json());
// If you need to handle URL-encoded data:
// app.use(express.urlencoded({ extended: true }));

// --- Routers ---
const authRouter = require('./routes/authrouter');
const categoryRouter = require('./routes/categoryrouter');
const postRouter = require('./routes/postrouter'); // Import the post router

// Import other routers like productRouter if you have them
// const productRouter = require('./routes/productRouter');

// --- Controllers & Middleware (for routes defined directly here) ---
const authController = require('./controllers/authcontroller');
const { ensureAuthenticated } = require('./middleware/auth'); // Import auth middleware

// --- Simple Ping Route (for health checks) ---
app.get('/ping', (req, res) => {
    res.status(200).send('PONG');
});

// --- Logging Middleware (Optional: Log requests) ---
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// --- API Routes ---
// Mount authentication routes under /auth
app.use('/auth', authRouter);

// Mount category routes under /api/categories
app.use('/api/categories', categoryRouter);

// Mount user profile route under /api/user
// Protect this route using ensureAuthenticated middleware
app.get('/api/user/me', ensureAuthenticated, authController.me);
app.use('/api/posts', postRouter); // Mount the post router


// --- Static File Serving (Serve Frontend Build) ---
// IMPORTANT: This should come AFTER your API routes
// Adjust 'public' if your frontend build output is in a different directory
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));
console.log(`Serving static files from: ${staticPath}`);


// --- Catch-all Route (Handle SPA routing) ---
// IMPORTANT: This must come AFTER API routes and static files
// It sends index.html for any GET request that didn't match an API route or a static file.
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    // Check if index.html exists before sending
    // This prevents errors if the file is missing during development or build issues
    require('fs').access(indexPath, require('fs').constants.F_OK, (err) => {
        if (err) {
             console.warn(`WARN: index.html not found at ${indexPath}. SPA routing might not work.`);
             // Send a 404 or a simple message if index.html is crucial and missing
             res.status(404).send('Resource not found.');
        } else {
            res.sendFile(indexPath);
        }
    });
});


// --- Global Error Handling Middleware ---
// IMPORTANT: This must be the LAST `app.use()` call
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);

    // Send a generic error response
    // Avoid leaking stack traces or sensitive info in production
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected internal server error occurred.',
        // Optionally include error code or type in development
        // error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server successfully started and listening on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}`);
});