const express = require('express');
const router = express.Router();

// Mock database for storing users (you'll replace this with actual database later)
let users = []; // This will hold user data for now

// Signup route
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create a new user
  const newUser = { email, password };
  users.push(newUser);

  return res.status(201).json({ message: 'User created successfully', user: newUser });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.status(200).json({ message: 'Login successful', user });
});

module.exports = router;
