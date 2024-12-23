import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './loginpage';
import SignUpPage from './signup'; // Ensure you have this component created

function App() {
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (email, password) => {
    // Your login logic here (e.g., API call)
    console.log('Logging in with', email, password);

    // If login fails, set an error message (optional)
    setErrorMessage('Invalid credentials');
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
