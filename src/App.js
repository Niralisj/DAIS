// src/App.js (Revised Routing)
import React from 'react';
// Make sure BrowserRouter is wrapping this in index.js or similar
// Make sure AuthProvider is wrapping Routes (ideally just inside BrowserRouter)
import { Routes, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import LoginPage from './login/loginpage';
import SignUpPage from './signuppage/signup';
import UserPanel from './userpanel/userpanel';
import ProtectedRoute from './components/ProtectedRoute'; // Assuming path is correct
import SkinQuiz from './Quiz/welcometoquiz';
import Quiz from './Quiz/BeginQuiz';
import DIY from './DIY/diy';
import FindSkinType from "./Quiz/FindSkinType"; // Is this public or part of the quiz flow? Assuming public for now.
import Recs from './recommendations/recs';
import  Forum from './cf/forum'; // Corrected path assuming it's forum.jsx or forum/index.jsx
import 'react-toastify/dist/ReactToastify.css'; // Make sure this CSS is imported ONCE globally (e.g., in App.js or index.js)

function App() {
  return (
    // Ensure <AuthProvider> wraps <Routes> in your main index.js or wherever you render App
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/" element={<Homepage />} />
      {/* Assuming FindSkinType is a general info page, otherwise protect it */}
      <Route path="/FindSkinType" element={<FindSkinType />} />

      {/* Protected Routes */}
      <Route
        path="/user-panel"
        element={
          <ProtectedRoute>
            <UserPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skinquiz" // The welcome/start page for the quiz
        element={
          <ProtectedRoute>
            <SkinQuiz />
          </ProtectedRoute>
        }
      />
       <Route
        path="/quiz" // The actual quiz process
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diy"
        element={
          <ProtectedRoute>
            <DIY />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recs"
        element={
          <ProtectedRoute>
            <Recs />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/forum/*" // Protect the forum and any nested routes
        element={
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        }
      />
       {/* Add any other routes that need protection here */}
      
    </Routes>
  );
}

export default App;