import React, { useState } from 'react';
import '../styles/signup.css'; // Corrected the path for CSS file
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Hook to navigate between pages

  const onSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if passwords match
    if (password === confirmPassword) {
      // Save user data to localStorage (basic simulation)
      localStorage.setItem('user', JSON.stringify({ email, password }));

      // Show success message
      setSuccessMessage('Sign-up successful! You can now log in.');
      setErrorMessage(''); // Clear any previous error messages

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/'); // Navigate to the login page
      }, 2000);
    } else {
      // Show error message if passwords do not match
      setErrorMessage('Passwords do not match!');
      setSuccessMessage(''); // Clear success message
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-box">
        <h2>Create Account</h2>
        <form onSubmit={onSubmit}>
          {/* Email input */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm password input */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Display success or error message */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Submit button */}
          <button type="submit" className="sign-up-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
