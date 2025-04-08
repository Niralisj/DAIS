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

                // Use the login function from AuthContext
                login(jwtToken, userData.id, userData.name); // Pass userData.id and userData.name

                // Redirect to the page the user was trying to access, or the default
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 500); // Shorter delay might be fine

            } else if (error) {
                const details = error?.details?.[0]?.message || 'Login failed';
                handleError(details);
            } else {
                // Handle cases where success is false but no specific error object is returned
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
                    {/* Email Input */}
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
                    {/* Password Input */}
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
                     {/* Checkbox/Forgot Password (Keep UI if needed, functionality might change) */}
                    <div className="checkbox-group">
                        <div className="remember-me">
                            {/* Note: "Remember me" needs backend implementation not covered here */}
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" className="remember-label"> Remember me </label>
                        </div>
                        <Link to="/forgot-password" className="forgot-password-link"> Forgot Password? </Link>
                    </div>
                    {/* Login Button */}
                    <button type="submit" className="login-button">Login</button>
                </form>
                 {/* Link to Sign Up */}
                 <div className="social-login"> {/* Consider renaming this className if no social login */}
                    <p>
                        Don't have an account? <Link to="/sign-up">Create one</Link> {/* Link to your OFFICIAL signup page */}
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;