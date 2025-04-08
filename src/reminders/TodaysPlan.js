// src/TodaysPlan.js
import React from 'react';
import { FaCheckCircle, FaRegCircle, FaEdit } from 'react-icons/fa';
import { useReminderContext } from './ReminderContext';

function TodaysPlan() {
    const {
        // Provide a default empty array for todaysSchedules
        todaysSchedules = [],
        completionStatus,
        toggleCompletion,
        todayDateString,
        setEditingRoutineId
     } = useReminderContext();

    // Now this check is safe, even if context initially provides undefined
    if (todaysSchedules.length === 0) {
        return <div className="card empty-state">No routines scheduled for today. Add some in the Schedules section!</div>;
    }

    return (
        <section className="hub-section today-plan-section card">
            <ul className="schedule-list">
                {todaysSchedules.map(schedule => {
                    // Ensure schedule and schedule.id exist before creating key
                    if (!schedule || typeof schedule.id === 'undefined') {
                        console.warn("Skipping invalid schedule item:", schedule);
                        return null; // Skip rendering this item
                    }

                    const completionKey = `${schedule.id}_${todayDateString}`;
                    const isCompleted = !!completionStatus?.[completionKey]; // Optional chaining for safety

                    return (
                        <li key={schedule.id} className={`schedule-item ${isCompleted ? 'completed' : ''}`}>
                            <div className="schedule-time">{schedule.time ?? 'No time'}</div>
                            <div className="schedule-details">
                                <h4>{schedule.routineName ?? 'Unknown Routine'}</h4>
                                {/* Display Products - already checks length */}
                                {schedule.products && schedule.products.length > 0 && (
                                     <p className="product-list">
                                         <strong>Products:</strong> {schedule.products.join(', ')}
                                     </p>
                                )}
                                {/* Display Notes - check if exists */}
                                {schedule.routineNotes && (
                                    <p className="notes-display">
                                        <strong>Notes:</strong> {schedule.routineNotes}
                                    </p>
                                )}
                            </div>
                            <div className="schedule-actions button-group">
                                {/* Edit button - check routineId */}
                                {typeof schedule.routineId !== 'undefined' && (
                                     <button
                                         onClick={() => setEditingRoutineId(schedule.routineId)}
                                         className="edit-button icon-button button button-secondary button-small"
                                         title={`Edit '${schedule.routineName ?? 'routine'}' Routine`}
                                         aria-label={`Edit routine ${schedule.routineName ?? 'routine'}`}
                                     >
                                         <FaEdit />
                                     </button>
                                )}
                                {/* Complete button */}
                                <button
                                    onClick={() => toggleCompletion(schedule.id)}
                                    className={`complete-button icon-button ${isCompleted ? 'button-success' : 'button-outline'}`}
                                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                                    aria-label={isCompleted ? `Mark routine ${schedule.routineName ?? 'routine'} as incomplete` : `Mark routine ${schedule.routineName ?? 'routine'} as complete`}
                                >
                                    {isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                                </button>
                            </div>
                        </li>
                    );
                 })}
            </ul>
        </section>
    );
}

export default TodaysPlan;