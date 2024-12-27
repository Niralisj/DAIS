import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import SignUpPage from './pages/signup';
import Homepage from './pages/Homepage';

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleLogin = (email, password) => {
    console.log('Logging in with', email, password);

    // Temporary login logic for local development
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      setErrorMessage(''); // Clear error message on success
      setIsLoggedIn(true); // Set login state to true
      console.log('Login successful!');
      navigate('/homepage'); // Redirect to the homepage after login
    } else {
      setErrorMessage('Invalid credentials'); // Show error message
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage handleLogin={handleLogin} errorMessage={errorMessage} />}
      />
      <Route
        path="/homepage"
        element={isLoggedIn ? <Homepage /> : <LoginPage handleLogin={handleLogin} errorMessage={errorMessage} />}
      />
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
