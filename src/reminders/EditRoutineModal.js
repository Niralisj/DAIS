// src/EditRoutineModal.js
import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useReminderContext } from './ReminderContext';

function EditRoutineModal({ routineId, onClose }) {
    const { routines, products, updateRoutine } = useReminderContext();

    // Find the full routine object
    const routineToEdit = routines.find(r => r.id === routineId);

    // State for the form fields, initialized when routineToEdit is available
    const [editName, setEditName] = useState('');
    const [editProductIds, setEditProductIds] = useState([]);
    const [editNotes, setEditNotes] = useState('');

    // Effect to populate form when the routine object is found/changed
    useEffect(() => {
        if (routineToEdit) {
            setEditName(routineToEdit.name);
            setEditProductIds(routineToEdit.productIds || []);
            setEditNotes(routineToEdit.notes || '');
        } else {
            // Reset if routine not found (should not happen if logic is correct)
            setEditName('');
            setEditProductIds([]);
            setEditNotes('');
        }
    }, [routineToEdit]); // Depend on the found routine object

    const handleProductSelection = (productId) => {
        setEditProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!routineToEdit) return; // Safety check

        const updatedData = {
            id: routineToEdit.id,
            name: editName,
            productIds: editProductIds,
            notes: editNotes,
        };

        // Call context update function, close modal only on success
        if (updateRoutine(updatedData)) {
            onClose(); // Close the modal
        }
        // If updateRoutine fails (e.g., validation), the modal stays open
    };

    // If the routine isn't found (e.g., during initial render or error), don't render the form
    if (!routineToEdit) {
        // Optionally return a loading or error state, or null
         console.warn(`EditRoutineModal: Routine with ID ${routineId} not found.`);
         // You might want to call onClose() here too if the routine disappears
         // onClose();
         return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content card">
                <h3>Edit Routine: {routineToEdit.name}</h3>
                <form onSubmit={handleSubmit} className="hub-form vertical-form">
                     {/* Name Input */}
                     <div className="form-group">
                         <label htmlFor={`edit-modal-routine-name-${routineToEdit.id}`}>Routine Name:</label>
                         <input
                             id={`edit-modal-routine-name-${routineToEdit.id}`}
                             type="text"
                             value={editName}
                             onChange={(e) => setEditName(e.target.value)}
                             required
                         />
                     </div>
                     {/* Product Selector */}
                     <div className="form-group">
                         <label>Select Products:</label>
                         {products.length === 0 ? (<p>No products available.</p>) : (
                             <div className="checkbox-group scrollable-checkbox">
                                  {[...products].sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                                     <div key={`edit-modal-${p.id}`}>
                                         <input
                                             type="checkbox"
                                             id={`rm_prod_select_edit_modal_${p.id}`}
                                             checked={editProductIds.includes(p.id)}
                                             onChange={() => handleProductSelection(p.id)}
                                         />
                                         <label htmlFor={`rm_prod_select_edit_modal_${p.id}`}>{p.name}</label>
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
                     {/* Notes Input */}
                     <div className="form-group">
                         <label htmlFor={`edit-modal-routine-notes-${routineToEdit.id}`}>Notes:</label>
                         <textarea
                             id={`edit-modal-routine-notes-${routineToEdit.id}`}
                             value={editNotes}
                             onChange={(e) => setEditNotes(e.target.value)}
                             rows="3"
                             className="notes-textarea"
                         />
                     </div>
                     {/* Action Buttons */}
                     <div className="button-group modal-actions">
                         <button
                             type="submit"
                             disabled={!editName.trim() || editProductIds.length === 0}
                             className="button button-success" // Standard size button
                             aria-label="Save Changes"
                         >
                             <FaSave /> Save Changes
                         </button>
                         <button
                             type="button"
                             onClick={onClose} // Use the passed onClose function
                             className="button button-secondary" // Standard size button
                             aria-label="Cancel Edit"
                         >
                             <FaTimes /> Cancel
                         </button>
                     </div>
                </form>
            </div>
        </div>
    );
}

export default EditRoutineModal;