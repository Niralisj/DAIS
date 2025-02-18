import React, { useState, useRef } from "react";
import "./cf.css";

const Cf = () => {
  const [posts, setPosts] = useState([
    { id: 1, user: "Nirali", avatar: "🧴", content: "What's the best sunscreen for oily skin?", likes: 4, comments: ["Try Beauty of Joseon!"] },
    { id: 2, user: "Vidhi", avatar: "🌸", content: "Any tips for reducing acne scars?", likes: 7, comments: ["Vitamin C serums work wonders!"] },
  ]);

  const [newPost, setNewPost] = useState("");
  const postContainerRef = useRef(null);

  const handlePost = () => {
    if (newPost.trim() === "") return;

    const post = {
      id: posts.length + 1,
      user: "You",
      avatar: "🙋‍♀️",
      content: newPost,
      likes: 0,
      comments: [],
    };

    setPosts([post, ...posts]);
    setNewPost("");

    setTimeout(() => {
      postContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleLike = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  };

  const handleComment = (id, comment) => {
    setPosts(posts.map(post => post.id === id ? { ...post, comments: [...post.comments, comment] } : post));
  };

  return (
    <div className="chat-forum">
      <div className="header">
        <h1>🌿 Skincare Chat Forum</h1>
        <p>Connect with skincare lovers & share your experiences!</p>
        <button className="join-btn">Join Now</button>
      </div>

      <div className="forum-content">
        <aside className="sidebar">
          <h3>🔥 Trending Topics</h3>
          <ul>
            <li>#BestSunscreen</li>
            <li>#HydrationTips</li>
            <li>#GlowRoutine</li>
            <li>#AcneCare</li>
          </ul>

          <h3>⭐ Popular Discussions</h3>
          <ul>
            <li>How to fade acne scars?</li>
            <li>Best natural remedies?</li>
            <li>Affordable skincare products?</li>
          </ul>
        </aside>

        <div className="post-section">
          <div className="post-form">
            <textarea
              placeholder="Share your skincare thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength={250}
            />
            <div className="char-count">{newPost.length}/250</div>
            <button className="post-btn" onClick={handlePost}>Post ✨</button>
          </div>

          <div className="posts" ref={postContainerRef}>
            {posts.map((post) => (
              <div key={post.id} className="post">
                <div className="avatar">{post.avatar}</div>
                <div className="post-content">
                  <strong>{post.user}</strong>
                  <p>{post.content}</p>
                  <div className="post-actions">
                    <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
                    <button onClick={() => handleComment(post.id, "Nice!")}>💬 {post.comments.length}</button>
                  </div>
                  <div className="comments">
                    {post.comments.map((comment, index) => (
                      <p key={index} className="comment">💬 {comment}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cf;
