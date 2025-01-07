import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
  const isAuthenticated = localStorage.getItem('token'); // Check if token exists in localStorage

  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function UserPanel() {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect to the login page
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Panel</h2>
      <p>Welcome to your dashboard!</p>
      <button onClick={handleLogout} style={{ marginTop: '10px' }}>
        Logout
      </button>
    </div>
  );
}

export default UserPanel;
