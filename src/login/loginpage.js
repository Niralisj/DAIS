import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';
import '../login/loginpage.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function LoginPage() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const location = useLocation(); // Get location object
    const { login } = useAuth(); // Get the login function from context

    // Determine where to redirect after login
    const from = location.state?.from?.pathname || '/user-panel'; // Default to /user-panel if no previous location

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
            const url = `http://localhost:8080/auth/login`; // Your OFFICIAL endpoint
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            const { success, message, jwtToken, userData, error } = result; // Get the userData object

            if (success && jwtToken && userData?.id && userData?.name) { // Access id and name from userData
                handleSuccess(message || 'Login successful!');

                login(jwtToken, userData.id, userData.name); 

                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 500); 

            } else if (error) {
                const details = error?.details?.[0]?.message || 'Login failed';
                handleError(details);
            } else {
                handleError(message || 'Invalid credentials or server error.');
            }
        } catch (err) {
            console.error('Login error:', err);
            handleError('Something went wrong during login. Please try again later.');
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
                    {/* Login Button */}
                    <button type="submit" className="login-button">Login</button>
                </form>
                 {/* Link to Sign Up */}
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