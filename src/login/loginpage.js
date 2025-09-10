import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';
import '../login/loginpage.css';
import { useAuth } from '../context/AuthContext';

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

        if (!email || !password) {
            return handleError('Email and password are required');
        }

        try {
            await login(email, password);
            // The AuthContext now sets the user, so we can navigate immediately.
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login process failed:', err);
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