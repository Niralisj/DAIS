const PostModel = require('../models/post');
const CommentModel = require('../models/comment');
const mongoose = require('mongoose');

// Create a new post (Requires authentication)
const createPost = async (req, res) => {
    try {
        const { title, content, categories } = req.body;
        const newPost = new PostModel({
            title,
            content,
            author: req.user._id, // User ID from auth middleware
            categories: categories || []
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post' });
    }
};

// Get all posts (Optional: Implement pagination, filtering, sorting)
const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author', 'name').populate('categories', 'name').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId).populate('author', 'name').populate('categories', 'name');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Failed to fetch post' });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, content, categories } = req.body;
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { title, content, categories: categories || [], updatedAt: Date.now() },
            { new: true }
        ).populate('author', 'name').populate('categories', 'name');

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Failed to update post' });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await PostModel.findByIdAndDelete(postId);
        // Optionally delete associated comments
        await CommentModel.deleteMany({ post: postId });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Failed to delete post' });
    }
};

const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(userId)) {
            // Unlike the post
            post.likes = post.likes.filter(likeUserId => likeUserId.toString() !== userId.toString());
        } else {
            // Like the post
            post.likes.push(userId);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error liking/unliking post:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Failed to like/unlike post' });
    }
};

// Add a comment to a post (Requires authentication)
const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { text } = req.body;
        const userId = req.user._id;

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new CommentModel({
            text,
            author: userId,
            post: postId
        });

        const savedComment = await newComment.save();
        const populatedComment = await savedComment.populate('author', 'name');
        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

// Get comments for a specific post
const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID format' });
        }
        const comments = await CommentModel.find({ post: postId }).populate('author', 'name').sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};

// Delete a comment (Requires authentication and authorization)
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const comment = await CommentModel.findById(commentId).populate('post');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is the author of the comment or an admin
        if (comment.author.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await CommentModel.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }
        res.status(500).json({ message: 'Failed to delete comment' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    addComment,
    getCommentsByPostId,
    deleteComment
};