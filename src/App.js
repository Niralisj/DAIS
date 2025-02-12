import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import LoginPage from './login/loginpage';
import SignUpPage from './signuppage/signup';
import UserPanel from './userpanel/userpanel'; // Example of protected user panel page
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import SkinQuiz from './Quiz/skinquiz';


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
      <Route path="/skinquiz"
        element={<SkinQuiz />} /> {/* Make sure SkinQuiz is properly imported */}
    
    </Routes>
  );
}

export default App;
