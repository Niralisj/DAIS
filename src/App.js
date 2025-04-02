import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import LoginPage from './login/loginpage';
import SignUpPage from './signuppage/signup';
import UserPanel from './userpanel/userpanel'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import SkinQuiz from './Quiz/welcometoquiz';
import Quiz from './Quiz/BeginQuiz';
import DIY from './DIY/diy';
import FindSkinType from "./Quiz/FindSkinType"; 
import Recs from './recommendations/recs';
import Reminder from './reminders/reminders';  
//import Dashboard from './cf/pages/dashboard'; // Correct path to Dashboard.js

function App() {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/diy" element={<DIY />} />
        <Route path="/FindSkinType" element={<FindSkinType />} /> 
        <Route path="/recs" element={<Recs />} />
        <Route path="/reminder" element={<Reminder />} />

        {/* Protected routes */}
        <Route
          path="/user-panel"
          element={
            <ProtectedRoute>
              <UserPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/skinquiz" element={<SkinQuiz />} /> 
      </Routes>
  );
}

export default App;
