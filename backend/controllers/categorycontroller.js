// server/controllers/categorycontroller.js
const CategoryModel = require('../models/category'); // Adjust path if needed

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        // Fetch categories, sort alphabetically by name
        const categories = await CategoryModel.find({}).sort({ name: 1 });

        // TODO: If frontend needs product counts per category,
        // you'd need a more complex query here (e.g., using $lookup or separate counts).
        // For now, just sending the category list.
        res.status(200).json(categories);

    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Failed to fetch categories due to server error." });
    }
};

// Add a new category (Requires Auth/Admin Role)
const addCategory = async (req, res) => {
    try {
        // Assumes Joi validation middleware has run (if implemented)
        const { name } = req.body;

        // Trim whitespace from the name
        const trimmedName = name.trim();
        if (!trimmedName) {
             return res.status(400).json({ message: "Category name cannot be empty." });
        }


        // Check if category already exists (case-insensitive check)
        const existingCategory = await CategoryModel.findOne({ name: { $regex: `^${trimmedName}$`, $options: 'i' } });
        if (existingCategory) {
            return res.status(409).json({ message: `Category '${trimmedName}' already exists.` });
        }

        // Create and save the new category
        const newCategory = new CategoryModel({ name: trimmedName });
        await newCategory.save();

        // Return the newly created category
        res.status(201).json(newCategory);

    } catch (error) {
        console.error("Error adding category:", error);
        // Handle potential duplicate key errors from DB level if Joi check missed edge cases
        if (error.code === 11000) { // MongoDB duplicate key error
             return res.status(409).json({ message: `Category '${req.body.name}' already exists.` });
        }
        res.status(500).json({ message: "Failed to add category due to server error." });
    }
};

// Delete a category (Requires Auth/Admin Role)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if ID is a valid MongoDB ObjectId format (optional but good)
        if (!require('mongoose').Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format." });
        }

        // Optional: Check if it's a default category before deleting
        // const category = await CategoryModel.findById(id);
        // if (category && category.isDefault) { // Assuming 'isDefault' field exists
        //     return res.status(403).json({ message: "Default categories cannot be deleted." });
        // }
        // --- OR --- check by ID if you have known default IDs (like your frontend logic)
        if (['1', '2', '3', '4', '5'].includes(id)) { // Check against known *string* IDs if that's the case
             // Or convert `id` to Number if comparing with numbers, but IDs are usually strings
             return res.status(403).json({ message: "Default categories (ID <= 5) cannot be deleted." });
        }

        // TODO: Check if any products are associated with this category.
        // Prevent deletion or reassign products first? Requires ProductModel.
        // const productCount = await ProductModel.countDocuments({ category: id });
        // if (productCount > 0) {
        //    return res.status(400).json({ message: `Cannot delete category as ${productCount} products are associated with it.` });
        // }


        // Find and delete the category
        const result = await CategoryModel.findByIdAndDelete(id);

        if (!result) {
            // If result is null, the category with that ID was not found
            return res.status(404).json({ message: "Category not found." });
        }

        // Successfully deleted
        res.status(200).json({ message: "Category deleted successfully." }); // Or use 204 No Content

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Failed to delete category due to server error." });
    }
};

module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
};