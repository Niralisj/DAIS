import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../login/loginpage.css';

function LoginPage() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || '/user-panel';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        // The 'login' function in AuthContext handles all validation and API calls.
        try {
            await login(email, password);
            // If the login is successful, AuthContext will update the token,
            // and the app will redirect automatically.
            navigate(from, { replace: true });
        } catch (error) {
            // The AuthContext.js already handles displaying the error toast,
            // so we don't need to do anything here.
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginInfo.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="checkbox-group">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" className="remember-label"> Remember me </label>
                        </div>
                        <Link to="/forgot-password" className="forgot-password-link"> Forgot Password? </Link>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="social-login">
                    <p>
                        Don't have an account? <Link to="/sign-up">Create one</Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;
