// src/ProductManager.js
import React, { useState } from 'react'; // Import useState for local state
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { useReminderContext } from './ReminderContext'; // Use context

function ProductManager() {
    // Get data and actions from context
    const { products, addProduct, deleteProduct } = useReminderContext();

    // Local state for the input form
    const [newProductName, setNewProductName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addProduct(newProductName); // Use action from context
        setNewProductName(''); // Clear local input state
    };

    return (
        <section className="hub-section product-section card">
            <h3>Add a New Product</h3>
            <form onSubmit={handleSubmit} className="hub-form">
                <input
                    type="text"
                    value={newProductName} // Controlled by local state
                    onChange={(e) => setNewProductName(e.target.value)} // Update local state
                    placeholder="New product name..."
                    required
                    aria-label="New product name"
                />
                <button type="submit" title="Add Product"><FaPlusCircle /></button>
            </form>

            <h3>Your Products</h3>
            <div className="item-list product-list">
                 {products.length === 0 ? (
                     <p className="empty-state-small">No products added yet. Add one above!</p>
                 ) : (
                    <ul>
                        {products.map(p => (
                            <li key={p.id}>
                                <span>{p.name}</span>
                                <button
                                    onClick={() => deleteProduct(p.id)} // Use action from context
                                    className="delete-button icon-button"
                                    title="Delete Product"
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

export default ProductManager;