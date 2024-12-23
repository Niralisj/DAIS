import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // This will help us navigate to another page after success

  const onSubmit = (e) => {
    e.preventDefault();  // Prevent the form from reloading

    if (password === confirmPassword) {
      // Store user data in localStorage (temporary solution)
      localStorage.setItem('user', JSON.stringify({ email, password }));

      // Display success message
      setSuccessMessage('Sign-up successful! You can now log in.');
      setErrorMessage(''); // Clear any error messages

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/');  // Redirect to the login page
      }, 2000);
    } else {
      // If passwords don't match
      setErrorMessage('Passwords do not match!');
      setSuccessMessage(''); // Clear success message if there's an error
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-box">
        <h2>Create Account</h2>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Display success or error message */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="sign-up-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
