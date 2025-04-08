// server/models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Add other fields if needed, e.g., description, isDefault
    // isDefault: {
    //    type: Boolean,
    //    default: false
    // }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);