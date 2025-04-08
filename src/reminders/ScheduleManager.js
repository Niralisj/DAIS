// src/ScheduleManager.js
import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useReminderContext } from './ReminderContext';

function ScheduleManager() {
    // Get data and actions from context
    const { schedules, routines, addSchedule, deleteSchedule, getRoutineNameById, daysOfWeek } = useReminderContext();

    // Local state for the form
    const [selectedRoutineId, setSelectedRoutineId] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    const handleDaySelection = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call context action, it returns true on success
        if (addSchedule(selectedRoutineId, scheduleTime, selectedDays)) {
            // Clear local form state on success
            setSelectedRoutineId('');
            setScheduleTime('');
            setSelectedDays([]);
            // Manually clear checkboxes visually (since they aren't directly controlled)
            const checkboxes = e.target.elements; // Get form elements
             for (let i = 0; i < checkboxes.length; i++) {
                 if (checkboxes[i].type === 'checkbox' && daysOfWeek.includes(checkboxes[i].value)) {
                     checkboxes[i].checked = false;
                 }
             }
        }
    };

    return (
        <section className="hub-section schedule-section card">
            <h3>Add a New Schedule</h3>
            <form onSubmit={handleSubmit} className="hub-form vertical-form">
                <div className="form-group">
                    <label htmlFor="sm-routine-select">Routine to Schedule:</label>
                    <select
                        id="sm-routine-select"
                        value={selectedRoutineId} // Local state
                        onChange={(e) => setSelectedRoutineId(e.target.value)} // Local state
                        required
                        disabled={routines.length === 0}
                    >
                        <option value="" disabled>-- Select a Routine --</option>
                        {/* Sort routines in dropdown */}
                        {[...routines].sort((a, b) => a.name.localeCompare(b.name)).map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    {routines.length === 0 && <p className="empty-state-small" style={{marginTop: '5px'}}>Create a routine first!</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="sm-schedule-time">Time:</label>
                    <input
                        type="time"
                        id="sm-schedule-time"
                        value={scheduleTime} // Local state
                        onChange={(e) => setScheduleTime(e.target.value)} // Local state
                        required
                    />
                </div>

                <div className="form-group">
                     <label>Repeat on Day(s):</label>
                     <div className="checkbox-group day-selector schedule-day-checkbox-manager">
                        {daysOfWeek.map((day) => (
                            <div key={day}>
                                <input
                                    type="checkbox"
                                    id={`sm_schedule_day_${day}`}
                                    value={day}
                                    // Let local 'selectedDays' state drive the logic
                                    // Checked attribute handled visually if needed via CSS/JS, but state is source of truth
                                    onChange={() => handleDaySelection(day)} // Local state update
                                    // Optionally add checked prop for visual state if CSS doesn't handle it
                                    // checked={selectedDays.includes(day)}
                                />
                                <label htmlFor={`sm_schedule_day_${day}`}>{day.substring(0,3)}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={routines.length === 0 || !selectedRoutineId || !scheduleTime || selectedDays.length === 0}
                >
                    Add Schedule
                </button>
            </form>

            <h3>Your Schedules</h3>
             <div className="item-list schedule-list">
                {schedules.length === 0 ? (
                    <p className="empty-state-small">No schedules added yet.</p>
                ) : (
                    <ul>
                        {/* Sort schedules by time for better display */}
                        {[...schedules].sort((a, b) => a.time.localeCompare(b.time) || getRoutineNameById(a.routineId).localeCompare(getRoutineNameById(b.routineId)) ).map(s => (
                            <li key={s.id}>
                                 <div className="schedule-details">
                                    <strong>{getRoutineNameById(s.routineId)}</strong> at <strong>{s.time}</strong>
                                    <small>Days: {s.days.join(', ')}</small>
                                </div>
                                <button
                                    onClick={() => deleteSchedule(s.id)} // Context action
                                    className="delete-button icon-button"
                                    title="Delete Schedule"
                                    aria-label={`Delete schedule for ${getRoutineNameById(s.routineId)} at ${s.time}`}
                                >
                                     <FaTrashAlt />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default ScheduleManager;