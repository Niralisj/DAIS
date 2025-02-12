import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../signuppage/signup.css'; 

function SignUpPage() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = signupInfo;

    if (!name  || !email || !password || !confirmPassword) {
      return handleError('All fields are required.');
    }

    if (password !== confirmPassword) {
      return handleError('Passwords do not match.');
    }

    try {
      const { name, email, password } = signupInfo; // ✅ Extract only necessary fields
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }), // ✅ No `username`
      });
      

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        handleError(error?.details[0]?.message || message);
      }
    } catch (err) {
      handleError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="signup-box">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input onChange={handleChange} type="text" name="name" placeholder="Enter your name..." value={signupInfo.name} />
          </div>
         
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={handleChange} type="email" name="email" placeholder="Enter your email..." value={signupInfo.email} />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={handleChange} type="password" name="password" placeholder="Enter your password..." value={signupInfo.password} />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input onChange={handleChange} type="password" name="confirmPassword" placeholder="Re-enter your password..." value={signupInfo.confirmPassword} />
          </div>
          <button type="submit" className="sign-up-button">Sign Up</button>
        </form>
        <p className="redirect-message">
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
        <p className="forgot-password">
          <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUpPage;
