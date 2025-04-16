const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { signupValidation, loginValidation } = require('../middleware/authvalidation');

// POST /auth/signup
router.post('/signup', signupValidation, authController.signup);

// POST /auth/login
router.post('/login', loginValidation, authController.login);

// POST /auth/refresh 
router.post('/refresh', authController.refresh);


module.exports = router;