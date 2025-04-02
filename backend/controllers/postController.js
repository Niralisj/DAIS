// server/controllers/postsController.js
const admin = require('firebase-admin');
const serviceAccount = require('../../firebase/serviceAccountKey.json'); // Path to your service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const createPost = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted from JWT
    const { content } = req.body;

    await admin.firestore().collection('posts').add({
      userId,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Firebase error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPosts = async (req, res) => {
  try {
    const postsSnapshot = await admin.firestore().collection('posts').orderBy('timestamp', 'desc').get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    console.error('Firebase error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createPost, getPosts };