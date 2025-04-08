// src/ReminderContext.js
import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

// Make sure context is created *outside* the component
const ReminderContext = createContext();

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ReminderProvider = ({ children }) => {
    // --- Core State Management ---
    const [products, setProducts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [completionStatus, setCompletionStatus] = useState({});
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [notifiedToday, setNotifiedToday] = useState({});

    // --- Refs ---
    const intervalRef = useRef(null);

    // --- Date & Time ---
    // Use useCallback for stability if passed down, though only used internally here
    const getTodayDateString = useCallback(() => new Date().toISOString().split('T')[0], []);
    const getTodayDayName = useCallback(() => daysOfWeek[new Date().getDay()], []);

    // We need today's date string frequently, let's memoize it for the current render cycle
    const todayDateString = useMemo(getTodayDateString, [getTodayDateString]);
    const todayDayName = useMemo(getTodayDayName, [getTodayDayName]);


    // --- Derived State (Memoized Helpers) ---
    const getProductNameById = useMemo(() => {
        // console.log("Recalculating getProductNameById map"); // Debug recalculation
        const map = new Map(products.map(p => [p.id, p.name]));
        return (id) => map.get(id) || 'Unknown Product';
    }, [products]);

    const getRoutineNameById = useMemo(() => {
        // console.log("Recalculating getRoutineNameById map"); // Debug recalculation
        const map = new Map(routines.map(r => [r.id, r.name]));
        return (id) => map.get(id) || 'Unknown Routine';
    }, [routines]);

    // --- Action Handlers (Simplified for Context) ---
    const addProduct = useCallback((name) => {
        if (!name.trim()) return;
        // Use a more robust ID generation if possible, but Date.now() is used in user code
        const newProduct = { id: Date.now(), name: name.trim() };
        setProducts(prev => [...prev, newProduct]);
        console.log('Product added:', newProduct);
    }, []);

    const deleteProduct = useCallback((id) => {
        const productName = getProductNameById(id); // Get name before deleting
        setProducts(prev => prev.filter(p => p.id !== id));
        // Remove product from routines that use it
        setRoutines(prevRoutines => prevRoutines.map(r => ({
            ...r,
            productIds: r.productIds?.filter(pid => pid !== id) || []
        })));
        console.log('Product deleted:', productName, id);
    }, [getProductNameById]); // Include dependency


    const addRoutine = useCallback((name, productIds, notes = '') => {
        if (!name.trim() || productIds.length === 0) {
            alert("Routine name and at least one product are required.");
            return false; // Indicate failure
        }
        const newRoutine = {
            id: Date.now() + 1, // Offset slightly from product ID generation
            name: name.trim(),
            productIds: [...productIds],
            notes: notes.trim()
        };
        setRoutines(prev => [...prev, newRoutine]);
        console.log('Routine added:', newRoutine);
        return true; // Indicate success
    }, []);

    const deleteRoutine = useCallback((id) => {
        const routineName = getRoutineNameById(id); // Get name before deleting
        setRoutines(prev => prev.filter(r => r.id !== id));
        // Also remove associated schedules
        setSchedules(prev => prev.filter(s => s.routineId !== id));
        console.log('Routine deleted:', routineName, id);
    }, [getRoutineNameById]); // Include dependency

    // *** NEW: Update Routine Action ***
    const updateRoutine = useCallback((updatedRoutine) => {
        if (!updatedRoutine || !updatedRoutine.id) {
             console.error("updateRoutine called with invalid data:", updatedRoutine);
             return false; // Indicate failure
        }
        if (!updatedRoutine.name?.trim() || !updatedRoutine.productIds || updatedRoutine.productIds.length === 0) {
             alert("Routine name and at least one product are required for update.");
             return false; // Indicate failure
        }

        setRoutines(prevRoutines =>
            prevRoutines.map(routine =>
                routine.id === updatedRoutine.id
                ? { // Return the updated object, ensuring all fields are present
                    ...routine, // Keep potential other fields if they exist
                    name: updatedRoutine.name.trim(),
                    productIds: [...updatedRoutine.productIds],
                    notes: updatedRoutine.notes?.trim() ?? '', // Handle potentially undefined notes
                  }
                : routine // Keep other routines unchanged
            )
        );
        console.log('Routine updated:', updatedRoutine);
        return true; // Indicate success
    }, []); // No external dependencies needed for the update logic itself


    const addSchedule = useCallback((routineId, time, days) => {
        if (!routineId || !time || days.length === 0) {
             alert("Please select a routine, set a time, and choose at least one day.");
             return false; // Indicate failure
        }
        const newSchedule = {
            id: Date.now() + 2, // Offset slightly
            routineId: parseInt(routineId, 10),
            time: time,
            days: [...days].sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b))
        };
        setSchedules(prev => [...prev, newSchedule]);
        console.log('Schedule added:', newSchedule);
        return true; // Indicate success
    }, []); // daysOfWeek is constant

    const deleteSchedule = useCallback((id) => {
        const currentTodayDateString = getTodayDateString(); // Get fresh date string
        setSchedules(prev => prev.filter(s => s.id !== id));
        // Clean up related state for today
        setCompletionStatus(prev => { const newStatus = {...prev}; delete newStatus[`${id}_${currentTodayDateString}`]; return newStatus; });
        setNotifiedToday(prev => { const newNotified = {...prev}; delete newNotified[id]; return newNotified; });
        console.log('Schedule deleted:', id);
    }, [getTodayDateString]);

    const toggleCompletion = useCallback((scheduleId) => {
        const currentTodayDateString = getTodayDateString(); // Get fresh date string
        const key = `${scheduleId}_${currentTodayDateString}`;
        setCompletionStatus(prev => ({ ...prev, [key]: !prev[key] }));
        console.log('Toggled completion for:', key);
    }, [getTodayDateString]);

     // --- Notification Logic ---
    const requestNotificationPermission = useCallback(() => {
        console.log('requestNotificationPermission called'); // Log function entry

        if (!('Notification' in window)) {
            console.warn('Notifications not supported by this browser.');
            alert('This browser does not support desktop notification');
            setNotificationPermission('unsupported');
            return;
        }

        const currentPermission = Notification.permission;
        console.log('Current browser permission status:', currentPermission);
        // Don't set state here yet, let the request handle it or load effect

        // Don't re-request if already granted or denied by the browser
        if (currentPermission === 'granted') {
             console.log('Permission already granted.');
             setNotificationPermission('granted'); // Ensure state is correct
             return;
        }
         if (currentPermission === 'denied') {
             console.warn('Permission was previously denied. User must change browser settings.');
             alert('Notifications are blocked. Please enable them in your browser settings for this site.');
             setNotificationPermission('denied'); // Ensure state is correct
             return;
         }

        // Only request if permission is 'default'
        if (currentPermission === 'default') {
            console.log('Requesting notification permission from browser...');
            Notification.requestPermission() // This returns a Promise
                .then((permissionResult) => {
                    console.log('Browser permission request finished. Result:', permissionResult);
                    setNotificationPermission(permissionResult); // IMPORTANT: Update context state

                    if (permissionResult === 'granted') {
                        console.log('Notification permission GRANTED by user.');
                        try {
                             new Notification('Skincare Hub Reminders Enabled!', {
                                 body: 'You will now receive notifications for scheduled routines.',
                                 // icon: '/icon-192x192.png' // Optional icon
                             });
                             console.log('Test notification sent successfully.');
                        } catch (err) {
                             console.error('Error sending test notification:', err);
                        }
                    } else if (permissionResult === 'denied') {
                        console.warn('Notification permission DENIED by user.');
                        alert('You have blocked notifications. They can be re-enabled in browser settings.');
                    } else {
                         console.log('Notification permission request dismissed or ignored.');
                    }
                })
                .catch((err) => {
                     console.error('Error occurred during Notification.requestPermission():', err);
                     alert('An error occurred while requesting notification permission.');
                 });
        }
    }, []); // Empty dependency array is correct here

    // --- Effects (Loading, Saving, Notifications) ---
    useEffect(() => { // Load initial state & check permission
        console.log("Context Load Effect Running");
        if ('Notification' in window) {
            console.log("Setting initial permission state from browser:", Notification.permission);
            setNotificationPermission(Notification.permission);
        } else {
            console.log("Notifications not supported, setting state to 'unsupported'");
            setNotificationPermission('unsupported');
        }
        // Load from localStorage
        const currentTodayDateString = getTodayDateString(); // Ensure fresh date
        const savedProducts = localStorage.getItem('dais_products');
        const savedRoutines = localStorage.getItem('dais_routines');
        const savedSchedules = localStorage.getItem('dais_schedules');
        const savedCompletion = localStorage.getItem(`dais_completion_${currentTodayDateString}`);
        const savedNotified = localStorage.getItem(`dais_notified_${currentTodayDateString}`);

        console.log("Loading data from localStorage...");
        try {
            if (savedProducts) setProducts(JSON.parse(savedProducts));
            if (savedRoutines) setRoutines(JSON.parse(savedRoutines));
            if (savedSchedules) setSchedules(JSON.parse(savedSchedules));
            if (savedCompletion) setCompletionStatus(JSON.parse(savedCompletion));
            if (savedNotified) setNotifiedToday(JSON.parse(savedNotified));
            console.log("Data loading finished.");
        } catch (error) {
            console.error("Error parsing data from localStorage:", error);
            // Optional: Clear potentially corrupted data
            // localStorage.removeItem('dais_products'); // etc.
        }

    }, [getTodayDateString]); // Rerun only if the date changes (for completion/notified)

    useEffect(() => { // Save state changes
        console.log("Context Save Effect Running");
        try {
            const currentTodayDateString = getTodayDateString(); // Ensure fresh date
            localStorage.setItem('dais_products', JSON.stringify(products));
            localStorage.setItem('dais_routines', JSON.stringify(routines));
            localStorage.setItem('dais_schedules', JSON.stringify(schedules));
            localStorage.setItem(`dais_completion_${currentTodayDateString}`, JSON.stringify(completionStatus));
            localStorage.setItem(`dais_notified_${currentTodayDateString}`, JSON.stringify(notifiedToday));
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }, [products, routines, schedules, completionStatus, notifiedToday, getTodayDateString]);


    // Derived state for Today's Schedules
     const todaysSchedules = useMemo(() => {
         console.log("Calculating today's schedules...");
         const currentTodayDayName = getTodayDayName(); // Use fresh value
         return schedules
             .filter(s => s.days.includes(currentTodayDayName))
             .map(s => {
                 const routine = routines.find(r => r.id === s.routineId);
                 return {
                     ...s,
                     routineName: routine?.name || 'Unknown Routine',
                     routineNotes: routine?.notes || '', // Include notes
                     products: (routine?.productIds || [])
                         .map(pid => getProductNameById(pid)) // Use stable helper
                         .filter(name => name !== 'Unknown Product')
                 };
             })
             .sort((a, b) => a.time.localeCompare(b.time));
     }, [schedules, routines, getTodayDayName, getProductNameById]); // Dependencies updated


    useEffect(() => { // Notification interval
        console.log('Running notification interval effect. Permission:', notificationPermission);
        const checkReminders = () => {
            console.log('checkReminders called at', new Date().toLocaleTimeString());
            const now = new Date();
            const currentDay = daysOfWeek[now.getDay()];
            const currentTime = now.toTimeString().substring(0, 5); // HH:MM

            // Use the 'schedules' state variable directly available in the effect's closure
            // Use the 'notifiedToday' state variable directly available in the effect's closure
            // Use getRoutineNameById directly available in the effect's closure

            schedules.forEach(schedule => {
                const isDayMatch = schedule.days.includes(currentDay);
                const isTimeMatch = schedule.time === currentTime;
                const isAlreadyNotified = !!notifiedToday[schedule.id]; // Check latest notified state

                if (isDayMatch && isTimeMatch && !isAlreadyNotified)
                {
                    const routineName = getRoutineNameById(schedule.routineId);
                    console.log(`MATCH FOUND! Triggering notification for: ${routineName}`);

                    const title = `Skincare Reminder: ${schedule.time}`;
                    const body = `Time for your "${routineName}" routine!`;
                    try {
                        new Notification(title, { body });
                        console.log(`Notification sent for ${routineName}`);
                        // Update notified state *after* sending using functional update
                        setNotifiedToday(prevNotified => ({
                            ...prevNotified,
                            [schedule.id]: true
                        }));

                    } catch (err) {
                        console.error("Error showing notification:", err);
                    }
                }
            });
        };

        if (intervalRef.current) {
            console.log("Clearing previous interval");
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (notificationPermission === 'granted') {
             console.log("Starting reminder check interval...");
             checkReminders(); // Check immediately
             intervalRef.current = setInterval(checkReminders, 60000); // Check every minute
        } else {
            console.log("Reminder interval not started (permission not granted).")
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                console.log("Clearing reminder check interval on unmount/dependency change.");
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    // Make sure ALL variables from external scope used inside the effect are listed
    }, [schedules, notificationPermission, notifiedToday, getRoutineNameById]);


    // --- Value Provided by Context ---
    const value = {
        // State Data
        products,
        routines,
        schedules,
        completionStatus,
        notificationPermission,
        todaysSchedules, // Provide derived state
        todayDateString,
        todayDayName,
        daysOfWeek,

        // Helper Functions
        getProductNameById,
        getRoutineNameById,

        // Actions
        addProduct,
        deleteProduct,
        addRoutine,
        deleteRoutine,
        updateRoutine, // <-- Include the new action
        addSchedule,
        deleteSchedule,
        toggleCompletion,
        requestNotificationPermission
    };

    return (
        <ReminderContext.Provider value={value}>
            {children}
        </ReminderContext.Provider>
    );
};

// Custom hook to easily consume the context
export const useReminderContext = () => {
    const context = React.useContext(ReminderContext);
    if (context === undefined) {
        throw new Error('useReminderContext must be used within a ReminderProvider');
    }
    return context;
};