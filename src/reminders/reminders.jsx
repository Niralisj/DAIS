import React, { useState } from 'react';
import { ReminderProvider } from './ReminderContext'; 
import Sidebar from './Sidebar';
import TodaysPlan from './TodaysPlan';
import ProductManager from './ProductManager';
import RoutineManager from './RoutineManager';
import ScheduleManager from './ScheduleManager';
import NotificationDisplay from './NotificationDisplay';
import './r.css'; 

function ReminderApp() {
    const [activeSection, setActiveSection] = useState('today');

    // Determine the title based on the active section
    const getTitle = () => {
        switch (activeSection) {
            case 'today': return "Today's Plan";
            case 'products': return 'Manage Products';
            case 'routines': return 'Manage Routines';
            case 'schedules': return 'Manage Schedules';
            default: return 'Dais';
        }
    };

    return (
        <ReminderProvider>
            <div className="reminder-app-container">
                {/* Sidebar only needs functions to change the active section */}
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <main className="main-content">
                    <header className="content-header">
                        <h1>{getTitle()}</h1>
                        <NotificationDisplay />
                    </header>

                    <div className="content-body">
                        {/* Conditionally render sections */}
                        {/* No props needed now, they use context! */}
                        {activeSection === 'today' && <TodaysPlan />}
                        {activeSection === 'products' && <ProductManager />}
                        {activeSection === 'routines' && <RoutineManager />}
                        {activeSection === 'schedules' && <ScheduleManager />}
                    </div>
                </main>
            </div>
        </ReminderProvider>
    );
}

export default ReminderApp;