// server/routes/authrouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { signupValidation, loginValidation } = require('../middleware/authvalidation');

// POST /auth/signup
router.post('/signup', signupValidation, authController.signup);

// POST /auth/login
router.post('/login', loginValidation, authController.login);

// POST /auth/refresh (Token refresh endpoint)
router.post('/refresh', authController.refresh);

// Note: The '/api/user/me' route is defined and protected in server/index.js

module.exports = router;