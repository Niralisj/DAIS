// server/routes/categoryrouter.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categorycontroller');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth'); // Adjust path if needed
const { addCategoryValidation } = require('../middleware/authvalidation'); // Optional validation for adding

// GET /api/categories - Public route to get all categories
router.get('/', categoryController.getAllCategories);

// POST /api/categories - Protected route to add a new category (Admin only)
// Runs ensureAuthenticated, then isAdmin, then optional validation, then controller
router.post(
    '/',
    ensureAuthenticated,
    isAdmin,
    addCategoryValidation, // Add validation middleware here if created
    categoryController.addCategory
);

// DELETE /api/categories/:id - Protected route to delete a category (Admin only)
// Runs ensureAuthenticated, then isAdmin, then controller
router.delete(
    '/:id',
    ensureAuthenticated,
    isAdmin,
    categoryController.deleteCategory
);

module.exports = router;