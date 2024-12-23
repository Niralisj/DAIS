import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginpage'; // Ensure LoginPage component exists and is correctly exported
import SignUpPage from './pages/signup'; // Ensure SignUpPage component exists and is correctly exported
import './styles/index.css'; // Ensure the CSS file exists

function App() {
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (email, password) => {
    console.log('Logging in with', email, password);

    // Example logic for user authentication (temporary)
    const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      setErrorMessage(''); // Clear error message on success
      console.log('Login successful!');
      // Redirect or update state to show logged-in status here
    } else {
      setErrorMessage('Invalid credentials'); // Show error message
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage handleLogin={handleLogin} errorMessage={errorMessage} />}
        />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
