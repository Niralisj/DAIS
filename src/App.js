import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/loginpage';
import SignUpPage from './pages/signup';
import UserPanel from './pages/userpanel'; // Example of protected user panel page
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/" element={<Homepage />} />

      {/* Protected routes */}
      <Route
        path="/user-panel"
        element={
          <ProtectedRoute>
            <UserPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
