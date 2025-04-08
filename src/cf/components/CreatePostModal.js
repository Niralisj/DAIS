import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import '../style/4.css'; // Assuming path is correct

export default function CreatePostModal({ isOpen, onClose, onCreatePost }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [errorCategories, setErrorCategories] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // <-- Add submitting state

    const { token } = useAuth();

    useEffect(() => {
        let isMounted = true;
        if (isOpen) {
            setIsSubmitting(false); // Reset submitting state on open
            // Reset other fields
            setTitle('');
            setContent('');
            setSelectedCategories([]);
            setAvailableCategories([]);
            setErrorCategories(null);
            setIsLoadingCategories(false);

            const fetchCategories = async () => {
                setIsLoadingCategories(true);
                setErrorCategories(null);
                try {
                    const headers = {};
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                    const response = await fetch('http://localhost:8080/api/categories', { headers });

                    if (!isMounted) return;

                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data)) {
                            setAvailableCategories(data.filter(cat => cat && cat.id && cat.name));
                        } else {
                            console.warn("CreatePostModal: Fetched categories data is not an array:", data);
                            setErrorCategories("Received invalid category data.");
                        }
                    } else {
                        console.error('CreatePostModal: Failed to fetch categories:', response.status);
                        setErrorCategories(`Failed to fetch categories (${response.status})`);
                    }
                } catch (error) {
                    console.error('CreatePostModal: Error fetching categories:', error);
                    if (isMounted) setErrorCategories('Network error fetching categories.');
                } finally {
                    if (isMounted) setIsLoadingCategories(false);
                }
            };
            fetchCategories();
        }
        // Cleanup
        return () => { isMounted = false };
    }, [isOpen, token]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const category = availableCategories.find(cat => cat.id.toString() === categoryId);

        if (category && !selectedCategories.some(sc => sc.id === category.id)) {
            setSelectedCategories([...selectedCategories, category]);
        }
        e.target.value = ""; // Reset dropdown visually
    };

    const handleRemoveCategory = (categoryToRemove) => {
        setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryToRemove.id));
    };

    const handleSubmit = async (e) => { // Make async if onCreatePost is async
        e.preventDefault();
        if (!title.trim() || !content.trim() || isSubmitting) return; // Prevent if already submitting

        setIsSubmitting(true); // <-- Set submitting state to true

        try {
            // Consider if onCreatePost is asynchronous (e.g., API call)
            // await onCreatePost({ ... });
            onCreatePost({ // Assuming it's synchronous for now based on ForumPage
                title: title.trim(),
                content: content.trim(),
                // Decide if backend needs names or IDs. Sending names here.
                // categories: selectedCategories.map(cat => cat.name),
                // Or send IDs:
                categories: selectedCategories.map(cat => cat.id),
                // Or send the whole objects if needed by backend:
                // categories: selectedCategories,
            });
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Failed to create post:", error);
            // Optionally show an error message to the user here
            setIsSubmitting(false); // <-- Reset submitting state on error
        }
        // If onCreatePost is synchronous and doesn't throw errors,
        // onClose() will be called, and the isSubmitting state will reset
        // automatically when the modal re-opens due to the useEffect cleanup/setup.
        // If onCreatePost is async, you might move onClose() inside the try block
        // and keep setIsSubmitting(false) in a finally block or after await.
    };

    const isFormValid = title.trim() !== '' && content.trim() !== '';

    return (
        <Dialog open={isOpen} onClose={() => !isSubmitting && onClose()} className="create-post-modal-dialog relative z-40"> {/* Prevent closing while submitting */}
            <div className="modal-backdrop" aria-hidden="true" />
            <div className="modal-container">
                <Dialog.Panel className="modal-panel">
                    <div className="modal-header">
                        <Dialog.Title className="modal-title">Create a New Post</Dialog.Title>
                        <button onClick={() => !isSubmitting && onClose()} className="modal-close-button" disabled={isSubmitting}><X className="close-icon" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-fields">
                            {/* Title Input */}
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Post title" required disabled={isSubmitting}/>
                            </div>

                            {/* Category Selection */}
                             <div className="form-group">
                                <label htmlFor="categories" className="form-label">Categories</label>
                                {isLoadingCategories && <p className="text-xs text-gray-500">Loading categories...</p>}
                                {errorCategories && <p className="text-xs text-red-500">{errorCategories}</p>}
                                {!isLoadingCategories && !errorCategories && availableCategories.length === 0 && <p className="text-xs text-gray-500">No categories available.</p>}

                                {!isLoadingCategories && availableCategories.length > 0 && (
                                    <select
                                        id="categories"
                                        onChange={handleCategoryChange}
                                        className="form-select"
                                        value="" // Keep it uncontrolled for selection trigger
                                        disabled={isLoadingCategories || isSubmitting} // Disable during submit
                                    >
                                        <option value="" disabled>Select categories</option>
                                        {availableCategories
                                            .filter(cat => !selectedCategories.some(sc => sc.id === cat.id)) // Exclude already selected
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                    </select>
                                )}
                                <div className="selected-categories mt-2 flex flex-wrap gap-1"> {/* Added flex-wrap and gap */}
                                    {selectedCategories.map((category) => (
                                        <span key={category.id} className="category-tag">
                                            {category.name}
                                            <button
                                                type="button"
                                                onClick={() => !isSubmitting && handleRemoveCategory(category)} // Prevent removal during submit
                                                className="remove-tag-button"
                                                disabled={isSubmitting}
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Content Textarea */}
                            <div className="form-group">
                                <label htmlFor="content" className="form-label">Content</label>
                                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="form-textarea" placeholder="Write your post content..." required disabled={isSubmitting}/>
                            </div>
                        </div>
                        {/* Modal Actions */}
                        <div className="modal-actions">
                            <button type="button" onClick={() => !isSubmitting && onClose()} className="cancel-button" disabled={isSubmitting}>Cancel</button>
                            <button
                                type="submit"
                                // Disable if form invalid OR currently submitting
                                disabled={!isFormValid || isSubmitting}
                                className="create-button"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Post'} {/* Indicate loading state */}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}