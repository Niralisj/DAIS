import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './loginpage.css';

function LoginPage({ handleLogin, errorMessage }) {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const onSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleLogin(email, password); // Call the login handler passed from App.js
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {/* Login form */}
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email} // Bind email input value to state
              onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password} // Bind password input value to state
              onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            />
          </div>
          {/* Error message */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div className="checkbox-group">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" style={{ marginLeft: '0.5rem' }}>
                Remember me
              </label>
            </div>
            <button
              onClick={() => console.log('Forgot Password clicked')}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="social-login">
          <p>
            Don't have an account? <Link to="/sign-up">Create one</Link> {/* Update this line */}
          </p>
          <div className="social-icons">
            <button className="social-btn facebook-btn">Facebook</button>
            <button className="social-btn google-btn">Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
