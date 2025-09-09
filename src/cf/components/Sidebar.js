// src/components/Sidebar.js (Your Updated Code)
import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from "../../context/AuthContext"; // Correct relative path
import "../style/8.css"; // Assuming path is correct
import { useMemo } from 'react';
export default function Sidebar({ selectedCategory, onSelectCategory }) {
    const { isAuthenticated, user, token } = useAuth(); // Get data from context
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [fetchCategoriesError, setFetchCategoriesError] = useState(null);

const defaultCategories = useMemo(() => [
  { id: 'default-1', name: 'Announcements' },
  { id: 'default-2', name: 'General Discussion' },
  { id: 'default-3', name: 'Questions & Help' },
  { id: 'default-4', name: 'Off-Topic' },
  { id: 'default-5', name: 'Feedback' },
], []);
    // Determine isAdmin based on the user object from context
    const isAdmin = isAuthenticated && user?.role === 'admin';

    // --- Fetch and Combine Categories ---
    useEffect(() => {
        let isMounted = true; // Prevent state update on unmounted component
        const loadCategories = async () => {
            setIsLoadingCategories(true);
            setFetchCategoriesError(null);
            console.log("Sidebar: Attempting to fetch categories...");

            try {
                const response = await fetch('http://localhost:8080/api/categories');
                console.log("Sidebar: Fetch categories response status:", response.status);

                let fetchedCategories = [];
                if (response.ok) {
                    fetchedCategories = await response.json();
                    // Ensure fetched data is an array
                    if (!Array.isArray(fetchedCategories)) {
                       console.warn("Sidebar: Fetched categories data is not an array:", fetchedCategories);
                       fetchedCategories = []; // Treat as empty if not array
                    }
                    console.log("Sidebar: Fetched categories data:", fetchedCategories);
                } else {
                    const errorText = await response.text();
                    console.error("Sidebar: Failed to fetch categories. Status:", response.status, "Response:", errorText);
                    setFetchCategoriesError(`Failed to load categories (Status: ${response.status}). Default categories will be shown.`);
                    // Don't set fetchedCategories here, let it remain empty array
                }

                // Combine default categories with successfully fetched categories
                // Use Set for efficient duplicate checking by name
                const combined = [...defaultCategories];
                const names = new Set(defaultCategories.map(cat => cat.name.toLowerCase()));

                fetchedCategories.forEach(fetchedCat => {
                    if (fetchedCat && fetchedCat.name && !names.has(fetchedCat.name.toLowerCase())) {
                        combined.push(fetchedCat); // Add if name is unique
                        names.add(fetchedCat.name.toLowerCase());
                    }
                });

                 if (isMounted) {
                     setCategories(combined);
                 }

            } catch (error) {
                console.error('Sidebar: Error caught during fetch categories:', error);
                 if (isMounted) {
                    setFetchCategoriesError('A network error occurred. Default categories will be shown.');
                    setCategories(defaultCategories); // Fallback to default on network error
                 }
            } finally {
                 if (isMounted) setIsLoadingCategories(false);
                 console.log("Sidebar: Finished loading categories.");
            }
        };

        loadCategories();
        // Cleanup function
        return () => { isMounted = false; };
    }, [defaultCategories]); // Run only once on mount

    // --- Add Category (Admin Only) ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        const trimmedName = newCategory.trim();

        if (!isAdmin) { /* ... permission alert ... */ return; }
        if (!token) { alert('Authentication token is missing.'); return; }

        if (trimmedName && !categories.some((cat) => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
            try {
                const response = await fetch('http://localhost:8080/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: trimmedName }),
                });

                if (response.ok) {
                    const addedCategory = await response.json(); // Get the new category with its ID
                    setNewCategory('');
                    setIsAdding(false);
                    // Add the new category to the *current* state directly
                    // Combine with default just in case state was stale somehow
                     const combined = [...defaultCategories];
                     const names = new Set(defaultCategories.map(cat => cat.name.toLowerCase()));
                     // Add existing non-default categories
                     categories.filter(cat => !cat.id.toString().startsWith('default-')).forEach(fetchedCat => {
                         if (fetchedCat && fetchedCat.name && !names.has(fetchedCat.name.toLowerCase())) {
                             combined.push(fetchedCat);
                             names.add(fetchedCat.name.toLowerCase());
                         }
                     });
                     // Add the newly added category
                     if (addedCategory && addedCategory.name && !names.has(addedCategory.name.toLowerCase())) {
                          combined.push(addedCategory);
                     }
                     setCategories(combined);


                } else { /* ... handle add failure ... */
                     alert('Failed to add category.');
                     console.error("Failed to add category:", response.status, await response.text());
                }
            } catch (error) { /* ... handle add error ... */
                 console.error('Error adding category:', error);
                 alert('An error occurred while adding the category.');
            }
        } else { /* ... handle empty or duplicate name ... */
             if (!trimmedName) alert('Category name cannot be empty.');
             else alert('Category name already exists.');
        }
    };

    // --- Delete Category (Admin Only, skips defaults) ---
    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (!isAdmin) { /* ... permission alert ... */ return; }
        if (!token) { alert('Authentication token is missing.'); return; }

        // Prevent deleting default categories based on ID structure or known names
        if (categoryId.toString().startsWith('default-')) {
            alert('Default categories cannot be deleted.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This cannot be undone.`)) {
            try {
                const response = await fetch(`http://localhost:8080/api/categories/${categoryId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    if (selectedCategory === categoryName) {
                        onSelectCategory(null); // Deselect if current was deleted
                    }
                    // Remove from local state directly
                    setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
                } else { /* ... handle delete failure ... */
                    alert('Failed to delete category.');
                    console.error("Failed to delete category:", response.status, await response.text());
                }
            } catch (error) { /* ... handle delete error ... */
                 console.error('Error deleting category:', error);
                 alert('An error occurred while deleting the category.');
            }
        }
    };

    // --- Handle Category Click ---
    const handleCategoryClick = (categoryName) => {
        onSelectCategory(selectedCategory === categoryName ? null : categoryName);
    };

    // --- Render Logic ---
    return (
        // Use classes from style/8.css
        <aside className="sidebar-container">
            <div className="sidebar-sticky">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Categories</h2>
                        {/* Show Add button only if admin */}
                        {isAdmin && !isAdding && (
                            <button onClick={() => setIsAdding(true)} className="sidebar-add-button" title="Add category">
                                <Plus className="sidebar-add-icon" />
                            </button>
                        )}
                    </div>

                     {/* Loading/Error States */}
                     {isLoadingCategories && <p className="sidebar-loading">Loading...</p>}
                     {fetchCategoriesError && !isLoadingCategories && <p className="sidebar-error">{fetchCategoriesError}</p>}


                    {/* Add Category Form (Admin Only) */}
                    {isAdmin && isAdding && (
                        <div className="sidebar-add-form-container">
                            <form onSubmit={handleAddCategory} className="sidebar-add-form">
                                {/* ... input and buttons as provided ... */}
                                <input
                                    type="text" value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="New category name" className="sidebar-add-input" autoFocus
                                />
                                <div className="sidebar-add-buttons">
                                    <button type="button" onClick={() => { setIsAdding(false); setNewCategory(''); }} className="sidebar-cancel-button">Cancel</button>
                                    <button type="submit" disabled={!newCategory.trim()} className="sidebar-submit-button">Add</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Category List */}
                    {!isLoadingCategories && categories.length > 0 && (
                         <nav className="sidebar-nav">
                              {/* "All Posts" option */}
                              <button
                                  onClick={() => handleCategoryClick(null)} // Pass null for "All Posts"
                                  className={`sidebar-category-button ${selectedCategory === null ? 'sidebar-category-selected' : ''}`}
                              >
                                  <span>All Posts</span>
                                  {/* Optionally show total post count here */}
                              </button>

                             {/* Map through categories */}
                             {categories.map((category) => (
                                 <div key={category.id} className="sidebar-category-item-container">
                                     <button onClick={() => handleCategoryClick(category.name)} className={`sidebar-category-button ${selectedCategory === category.name ? 'sidebar-category-selected' : ''}`}>
                                         <span>{category.name}</span>
                                         {/* Display count if available */}
                                         {/* <span className={`sidebar-category-count ${selectedCategory === category.name ? 'sidebar-category-count-selected' : ''}`}>{category.count ?? 0}</span> */}
                                     </button>
                                     {/* Show delete button if admin and NOT a default category */}
                                     {isAdmin && !category.id.toString().startsWith('default-') && (
                                         <button onClick={() => handleDeleteCategory(category.id, category.name)} className="sidebar-delete-button" title="Delete category">
                                             <Trash2 className="sidebar-delete-icon" />
                                         </button>
                                     )}
                                 </div>
                             ))}
                         </nav>
                    )}
                </div>
            </div>
        </aside>
    );
}