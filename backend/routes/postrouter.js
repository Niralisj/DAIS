const express = require('express');
const router = express.Router();
const postController = require('../controllers/postcontroller');
const { ensureAuthenticated } = require('../middleware/auth');

// Public routes for fetching posts
router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.get('/:postId/comments', postController.getCommentsByPostId);

// Protected routes (require authentication)
router.post('/', ensureAuthenticated, postController.createPost);
router.put('/:postId', ensureAuthenticated, postController.updatePost);
router.delete('/:postId', ensureAuthenticated, postController.deletePost);
router.post('/:postId/like', ensureAuthenticated, postController.likePost);
router.post('/:postId/comments', ensureAuthenticated, postController.addComment);
router.delete('/comments/:commentId', ensureAuthenticated, postController.deleteComment);

module.exports = router;