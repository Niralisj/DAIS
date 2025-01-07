import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if the user is authenticated by looking for a token in localStorage
  const isAuthenticated = localStorage.getItem('token');

  // If authenticated, render the children (i.e., the UserPanel or any protected component)
  // If not authenticated, redirect to the login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

