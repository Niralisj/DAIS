// src/NotificationDisplay.js
import React from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import { useReminderContext } from './ReminderContext';

function NotificationDisplay() {
    const { notificationPermission, requestNotificationPermission } = useReminderContext();

    const handleEnableClick = () => {
        console.log('Enable Reminders button clicked'); // Log the click
        requestNotificationPermission(); // Call the context function
    };

    return (
        <div className="notification-control">
            {notificationPermission === 'granted' && (
                <span className="status granted"><FaBell /> Reminders Enabled</span>
            )}
            {notificationPermission === 'denied' && (
                <span className="status denied"><FaBellSlash /> Reminders Blocked</span>
            )}
            {/* Only show button if permission is 'default' */}
            {notificationPermission === 'default' && (
                <button onClick={handleEnableClick} className="enable-notifications-button">
                    <FaBell /> Enable Reminders
                </button>
            )}
             {notificationPermission === 'unsupported' && (
                <span className="status disabled"><FaBellSlash /> Not Supported</span>
            )}
        </div>
    );
}

export default NotificationDisplay;