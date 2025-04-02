// server/routes/PostRoute.js
const express = require('express');
const router = express.Router();
const postModel = require('../models/post');

router.get('/', /* ensureAuthenticated, */ async (req, res) => {
    try {
        const posts = await postModel.find().sort({ timestamps: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;