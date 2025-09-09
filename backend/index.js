const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' }); 

const app = express();

require('./models/db');

// Enable CORS to handle multiple origins
const allowedOrigins = [
  'https://daiis.netlify.app',
  'https://68c01a6b3dfa647cf0b6e788--daiis.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // If the origin is not on the allowed list, or if there is no origin (e.g. from Postman or a mobile app)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const authRouter = require('./routes/authrouter');
const categoryRouter = require('./routes/categoryrouter');
const postRouter = require('./routes/postrouter'); // Import the post router

// Import other routers like productRouter if you have them

const authController = require('./controllers/authcontroller');
const { ensureAuthenticated } = require('./middleware/auth'); // Import auth middleware

app.get('/ping', (req, res) => {
    res.status(200).send('PONG');
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/auth', authRouter);

// Mount category routes under /api/categories
app.use('/api/categories', categoryRouter);

// Mount user profile route under /api/user
// Protect this route using ensureAuthenticated middleware
app.get('/api/user/me', ensureAuthenticated, authController.me);
app.use('/api/posts', postRouter); // Mount the post router


const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));
console.log(`Serving static files from: ${staticPath}`);



app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    require('fs').access(indexPath, require('fs').constants.F_OK, (err) => {
        if (err) {
             console.warn(`WARN: index.html not found at ${indexPath}. SPA routing might not work.`);
             res.status(404).send('Resource not found.');
        } else {
            res.sendFile(indexPath);
        }
    });
});



app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);

    // Send a generic error response
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected internal server error occurred.',
      
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server successfully started and listening on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}`);
});