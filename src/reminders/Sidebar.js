// src/Sidebar.js
import React from 'react';
// Import desired icons
import { FaCalendarDay, FaBoxOpen, FaTasks, FaClock, FaChartLine, FaUsers } from 'react-icons/fa';

function Sidebar({ activeSection, setActiveSection }) {
    // Add new items here
    const navItems = [
        { id: 'today', label: 'Today\'s Plan', icon: <FaCalendarDay /> },
        { id: 'products', label: 'Products', icon: <FaBoxOpen /> },
        { id: 'routines', label: 'Routines', icon: <FaTasks /> },
        { id: 'schedules', label: 'Schedules', icon: <FaClock /> },
        { id: 'progress', label: 'Track Progress', icon: <FaChartLine /> }, // New Item
        { id: 'community', label: 'Community', icon: <FaUsers /> },       // New Item
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Skincare Hub</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(item.id)}
                                aria-current={activeSection === item.id ? 'page' : undefined}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <p>&copy; {new Date().getFullYear()} Dais </p>
            </div>
        </aside>
    );
}

export default Sidebar;