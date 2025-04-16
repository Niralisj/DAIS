import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../userpanel/userpanel.css';

function UserPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <section id="home" className="hero2">
      <div className="hero-content">
        <h1>Welcome to Your Dashboard</h1>
        <p>Discover your skin type, track progress, and explore personalized recommendations.</p>
      </div>

      {/* Buttons Section */}
      <div className="userpanel-buttons">
        <button className="grid-button" onClick={() => navigate('/skinquiz')}>
          Find Your Skin Type
        </button>
        <button className="grid-button" onClick={() => navigate('/quiz')}>
          Recommended Products
        </button>
        <button className="grid-button" onClick={() => navigate('/forum')}>
          Join Community
        </button>
        <button className="grid-button" onClick={() => navigate('/reminder')}>
         History
        </button>
      </div>

      {/* Logout Section */}
      <div className="userpanel-logout">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}

export default UserPanel;
