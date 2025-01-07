

const { signup, login } = require('../controllers/authcontroller');
const { signupValidation, loginValidation } = require('../middleware/authvalidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);


module.exports = router;
