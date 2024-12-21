import React from 'react';
import './loginpage.css';

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <div className="checkbox-group">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" style={{ marginLeft: '0.5rem' }}>Remember me</label>
            </div>
            <button
              onClick={() => console.log('Forgot Password clicked')}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
            >
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="social-login">
          <p>Don't have an account? <a href="/create-account">Create one</a></p>
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
