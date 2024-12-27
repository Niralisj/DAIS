const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Import routes
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Use auth routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
