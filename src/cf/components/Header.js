// src/components/Header.js (Your Updated Code)
import React from 'react'; // Removed useState, useEffect
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext'; // Correct relative path


// Assuming style/5.css contains the necessary styles
import '../style/5.css';

function Header({ searchQuery, onSearchChange }) {
    // Get state and logout function from AuthContext
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate(); // Hook for navigation

    const handleSignInClick = () => {
        navigate('/login'); // Navigate to login page
    };

    const handleSignUpClick = () => {
        navigate('/sign-up'); // Navigate to sign up page
    };

    // Logout handler that potentially navigates
    const handleLogout = () => {
        logout(); // Call logout from context
        navigate('/'); // Navigate to home page after logout
    };

    return (
        <header className='header'>
            <div className='header-container'>
                <Link to="/" className='header-logo'>
                    Dais Community Forum {/* Updated Text */}
                </Link>

                <div className='header-actions'>
                    {/* Search Input */}
                    <input
                        type='text'
                        placeholder='Search posts...'
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className='search-input' // Ensure this class is styled in 5.css
                    />

                    {/* Conditional rendering based on AuthContext */}
                    {isAuthenticated && user ? (
                        <Menu as='div' className='user-menu'> {/* Use classes from 5.css */}
                            <div>
                                <Menu.Button className='user-menu-button'>
                                    {user.name || 'User'} {/* Display user's name */}
                                    {/* Ensure ChevronDownIcon is styled if needed */}
                                    <ChevronDownIcon className='chevron-icon h-5 w-5' aria-hidden='true' />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={React.Fragment}
                                enter='transition ease-out duration-100'
                                enterFrom='transform opacity-0 scale-95'
                                enterTo='transform opacity-100 scale-100'
                                leave='transition ease-in duration-75'
                                leaveFrom='transform opacity-100 scale-100'
                                leaveTo='transform opacity-0 scale-95'
                            >
                                <Menu.Items className='user-menu-items'>
                                    <div className='menu-items-container'> {/* Use class from 5.css */}
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout} // Use updated logout handler
                                                    className={`menu-item ${active ? 'active' : ''}`} // Classes from 5.css
                                                >
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                        {/* Add other menu items here */}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    ) : (
                        <div className="flex items-center space-x-2"> {/* Added container */}
                            <button
                                onClick={handleSignInClick}
                                className='sign-in-button' // Ensure styled in 5.css
                            >
                                Sign In
                            </button>
                            <button
                                onClick={handleSignUpClick}
                                className='sign-up-button' // Ensure styled in 5.css
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;