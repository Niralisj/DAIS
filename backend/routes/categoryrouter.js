const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categorycontroller');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth'); // Adjust path if needed
const { addCategoryValidation } = require('../middleware/authvalidation'); // Optional validation for adding

router.get('/', categoryController.getAllCategories);


router.post(
    '/',
    ensureAuthenticated,
    isAdmin,
    addCategoryValidation, // Add validation middleware here if created
    categoryController.addCategory
);


router.delete(
    '/:id',
    ensureAuthenticated,
    isAdmin,
    categoryController.deleteCategory
);

module.exports = router;