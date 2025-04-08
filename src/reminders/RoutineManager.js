// src/RoutineManager.js
import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'; // Import new icons
import { useReminderContext } from './ReminderContext';

function RoutineManager() {
    // Get data and actions from context
    const {
        routines,
        products,
        addRoutine,
        deleteRoutine,
        updateRoutine, // <-- Get the update action
        getProductNameById
    } = useReminderContext();

    // --- State for ADDING a new routine ---
    const [newRoutineName, setNewRoutineName] = useState('');
    const [newSelectedProductIds, setNewSelectedProductIds] = useState([]);
    const [newRoutineNotes, setNewRoutineNotes] = useState('');

    // --- State for EDITING a routine ---
    const [editingRoutineId, setEditingRoutineId] = useState(null); // ID of routine being edited
    const [editRoutineName, setEditRoutineName] = useState('');
    const [editSelectedProductIds, setEditSelectedProductIds] = useState([]);
    const [editRoutineNotes, setEditRoutineNotes] = useState('');

    // --- Handler for ADDING ---
    const handleAddProductSelection = (productId) => {
        setNewSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (addRoutine(newRoutineName, newSelectedProductIds, newRoutineNotes)) {
            setNewRoutineName('');
            setNewSelectedProductIds([]);
            setNewRoutineNotes('');
        }
    };

    // --- Handlers for EDITING ---
    const handleEditClick = (routine) => {
        setEditingRoutineId(routine.id);
        setEditRoutineName(routine.name);
        // Ensure productIds and notes are arrays/strings even if undefined in data
        setEditSelectedProductIds(routine.productIds || []);
        setEditRoutineNotes(routine.notes || '');
    };

    const handleCancelEdit = () => {
        setEditingRoutineId(null);
        // No need to clear edit form state here, it will be overwritten on next edit click
    };

    const handleEditProductSelection = (productId) => {
        setEditSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (editingRoutineId) {
            const updatedData = {
                id: editingRoutineId,
                name: editRoutineName,
                productIds: editSelectedProductIds,
                notes: editRoutineNotes,
            };
            if (updateRoutine(updatedData)) { // Call context update function
                handleCancelEdit(); // Exit edit mode on success
            }
            // If updateRoutine returns false (due to validation), we stay in edit mode
        }
    };


    // --- Render ---
    return (
        <section className="hub-section routine-section card">
            {/* --- ADD Routine Form --- */}
            <h3>Create a New Routine</h3>
            <form onSubmit={handleAddSubmit} className="hub-form vertical-form add-routine-form">
                {/* Routine Name Input */}
                <div className="form-group">
                    <label htmlFor="routine-name-input">Routine Name:</label>
                    <input
                        id="routine-name-input"
                        type="text"
                        value={newRoutineName}
                        onChange={(e) => setNewRoutineName(e.target.value)}
                        placeholder="e.g., Morning Glow"
                        required
                    />
                </div>

                {/* Product Selector for ADD */}
                <div className="form-group">
                    <label>Select Products for this Routine:</label>
                    {products.length === 0 ? (
                        <p className="empty-state-small">Add products in the 'Products' section first!</p>
                    ) : (
                        <div className="checkbox-group scrollable-checkbox">
                             {[...products].sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                                <div key={`add-${p.id}`}> {/* Ensure unique key */}
                                    <input
                                        type="checkbox"
                                        id={`rm_prod_select_add_${p.id}`}
                                        checked={newSelectedProductIds.includes(p.id)}
                                        onChange={() => handleAddProductSelection(p.id)}
                                    />
                                    <label htmlFor={`rm_prod_select_add_${p.id}`}>{p.name}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes Input for ADD */}
                <div className="form-group">
                    <label htmlFor="routine-notes-input">Notes (Optional):</label>
                    <textarea
                        id="routine-notes-input"
                        value={newRoutineNotes}
                        onChange={(e) => setNewRoutineNotes(e.target.value)}
                        placeholder="e.g., Focus on hydration, use specific serum..."
                        rows="3"
                        className="notes-textarea"
                    />
                </div>

                <button
                    type="submit"
                    disabled={products.length === 0 || !newRoutineName.trim() || newSelectedProductIds.length === 0}
                    className="button button-primary" // Add button classes
                >
                    Save New Routine
                </button>
            </form>

             <hr className="section-divider"/> {/* Add a visual separator */}

            {/* --- Routine LIST --- */}
            <h3>Your Routines</h3>
            <div className="item-list routine-list">
                {routines.length === 0 ? (
                    <p className="empty-state-small">No routines created yet.</p>
                ) : (
                    <ul>
                         {/* Sort routines alphabetically for display */}
                        {[...routines].sort((a, b) => a.name.localeCompare(b.name)).map(r => (
                            <li key={r.id} className={`routine-list-item ${editingRoutineId === r.id ? 'editing' : ''}`}>
                                {editingRoutineId === r.id ? (
                                    // --- EDITING FORM VIEW ---
                                    <form onSubmit={handleUpdateSubmit} className="hub-form vertical-form edit-routine-form">
                                        <h4>Editing: {r.name}</h4>
                                        {/* Name Input */}
                                        <div className="form-group">
                                            <label htmlFor={`edit-routine-name-${r.id}`}>Routine Name:</label>
                                            <input
                                                id={`edit-routine-name-${r.id}`}
                                                type="text"
                                                value={editRoutineName}
                                                onChange={(e) => setEditRoutineName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {/* Product Selector */}
                                        <div className="form-group">
                                            <label>Select Products:</label>
                                            {products.length === 0 ? (<p>No products available.</p>) : (
                                                <div className="checkbox-group scrollable-checkbox">
                                                     {[...products].sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                                                        <div key={`edit-${p.id}`}> {/* Ensure unique key */}
                                                            <input
                                                                type="checkbox"
                                                                id={`rm_prod_select_edit_${p.id}`}
                                                                checked={editSelectedProductIds.includes(p.id)}
                                                                onChange={() => handleEditProductSelection(p.id)}
                                                            />
                                                            <label htmlFor={`rm_prod_select_edit_${p.id}`}>{p.name}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {/* Notes Input */}
                                        <div className="form-group">
                                            <label htmlFor={`edit-routine-notes-${r.id}`}>Notes:</label>
                                            <textarea
                                                id={`edit-routine-notes-${r.id}`}
                                                value={editRoutineNotes}
                                                onChange={(e) => setEditRoutineNotes(e.target.value)}
                                                rows="3"
                                                className="notes-textarea"
                                            />
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="button-group">
                                            <button
                                                type="submit"
                                                disabled={!editRoutineName.trim() || editSelectedProductIds.length === 0}
                                                className="button button-success button-small"
                                                aria-label="Save Changes"
                                            >
                                                <FaSave /> Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="button button-secondary button-small"
                                                aria-label="Cancel Edit"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // --- DISPLAY VIEW ---
                                    <div className="routine-display">
                                        <div className="routine-details">
                                            <strong>{r.name}</strong>
                                            <small>Products: {r.productIds.map(id => getProductNameById(id)).join(', ') || 'None'}</small>
                                            {r.notes && (
                                                <p className="notes-display">
                                                    <strong>Notes:</strong> {r.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="button-group routine-actions">
                                             <button
                                                onClick={() => handleEditClick(r)}
                                                className="edit-button icon-button button button-secondary button-small" // Add classes
                                                title="Edit Routine"
                                                aria-label={`Edit routine ${r.name}`}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => deleteRoutine(r.id)}
                                                className="delete-button icon-button button button-danger button-small" // Add classes
                                                title="Delete Routine"
                                                aria-label={`Delete routine ${r.name}`}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default RoutineManager;