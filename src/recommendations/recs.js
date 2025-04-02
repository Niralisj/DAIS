import React, { useState, useCallback } from "react";
import "./recs.css"; // Ensure this path is correct
import Routine from "./routine"; // Ensure this path is correct

// --- Constants for Select Options ---
const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const PRODUCT_TYPES = ["Cleanser", "Serum", "Moisturizer", "Sunscreen"];
const CATEGORIES = ["Indian", "Global"];


// --- Configuration ---
// It's best practice to store this in environment variables (.env file)
// Example: REACT_APP_API_BASE_URL=http://127.0.0.1:8000
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const Recs = () => {
    // --- State ---
    const [formData, setFormData] = useState({
        skinType: "",
        productType: "",
        category: "",
        concerns: "",
    });
    const [products, setProducts] = useState([]);
    const [defaultRoutine, setDefaultRoutine] = useState(null); // Stores fetched default routine data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchPerformed, setSearchPerformed] = useState(false); // Track if a search has been done

    // --- Event Handlers ---
    const handleInputChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Reset results when form changes
        setProducts([]);
        setDefaultRoutine(null);
        setError("");
        setSearchPerformed(false);
    }, []); // Empty dependency array means this function is created once

    // --- API Fetching Logic ---
    const fetchData = useCallback(async (url, isRoutineFetch = false) => {
        setLoading(true);
        setError("");
        setProducts([]); // Clear previous specific products
        setDefaultRoutine(null); // Clear previous default routine
        setSearchPerformed(true); // Mark that a search attempt is happening

        try {
            console.log("Fetching from:", url);
            const response = await fetch(url);

            if (!response.ok) {
                // Try to get more specific error from response body
                let errorBody = 'Unknown error';
                try {
                    errorBody = await response.text();
                } catch (_) { /* Ignore if response body cannot be read */ }
                throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorBody}`);
            }

            const data = await response.json();

            if (isRoutineFetch) {
                setDefaultRoutine(data);
                 // If routine fetch was successful, clear products explicitly
                setProducts([]);
            } else {
                setProducts(data);
                 // If product fetch was successful, clear default routine explicitly
                setDefaultRoutine(null);
            }

        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
            console.error("Fetch error details:", err);
            setProducts([]); // Ensure products are cleared on error
            setDefaultRoutine(null); // Ensure routine is cleared on error
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array, function created once

    const fetchRecommendations = useCallback(() => {
        const { skinType, productType, category, concerns } = formData;

        if (!skinType) {
            setError("Please select a skin type.");
            setSearchPerformed(false); // No search actually performed
            return;
        }

        // Fetch specific products if *both* productType and category are selected
        if (productType && category) {
            const queryParams = new URLSearchParams({
                skintype: skinType, // Assuming backend expects PascalCase or handles case-insensitivity
                product_type: productType.toLowerCase(),
                category: category.toLowerCase(),
            });
            // Only add concern if it's not empty
            if (concerns.trim()) {
                queryParams.append('concern', concerns.trim());
            }
            fetchData(`${API_BASE_URL}/recommendations?${queryParams.toString()}`, false);
        }
        // Otherwise, fetch the default routine for the selected skin type
        else {
            fetchData(`${API_BASE_URL}/default_routine?skintype=${skinType}`, true);
        }
    }, [formData, fetchData]); // Recreate if formData or fetchData changes

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        fetchRecommendations();
    }, [fetchRecommendations]); // Recreate if fetchRecommendations changes

    // --- Helper for Rendering Select Options ---
    const renderSelectOptions = (options) => (
        options.map((option) => (
            <option key={option} value={option}>{option}</option> // Keep value as display value for simplicity here
                                                                    // Adjust if backend needs lowercase consistently
        ))
    );

    // --- Determine what results to show ---
    const showProducts = !loading && products.length > 0;
    // *Important*: Decide if Routine component should display fetched `defaultRoutine` data
    // or if it fetches its own data based on skinType.
    // Option A: Routine uses fetched data (pass `defaultRoutine` as prop)
    // const showDefaultRoutine = !loading && defaultRoutine !== null;
    // Option B: Routine fetches its own data (render whenever skinType is selected, as in original code)
    const showRoutineComponent = !loading && !!formData.skinType; // Show if skinType is selected and not loading

    const showNoResultsMessage = searchPerformed && !loading && !error && products.length === 0 && defaultRoutine === null;

    // --- Render ---
    return (
        <div className="recs-container">
            <h2 className="recs-title">Product Recommendations</h2>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="recs-form">
                {/* Skin Type (Required) */}
                <div className="form-group">
                    <label htmlFor="skinType">Skin Type:</label>
                    <select id="skinType" name="skinType" value={formData.skinType} onChange={handleInputChange} required>
                        <option value="">Select Skin Type</option>
                        {renderSelectOptions(SKIN_TYPES)}
                    </select>
                </div>

                {/* Product Type (Optional for specific search) */}
                <div className="form-group">
                    <label htmlFor="productType">Product Type (for specific search):</label>
                    <select id="productType" name="productType" value={formData.productType} onChange={handleInputChange}>
                        <option value="">Select Product Type</option>
                        {renderSelectOptions(PRODUCT_TYPES)}
                    </select>
                </div>

                {/* Category (Optional for specific search) */}
                <div className="form-group">
                    <label htmlFor="category">Category (for specific search):</label>
                    <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {renderSelectOptions(CATEGORIES)}
                    </select>
                </div>

                {/* Concerns (Optional) */}
                <div className="form-group">
                    <label htmlFor="concerns">Concerns (Optional):</label>
                    <input
                        type="text"
                        id="concerns"
                        name="concerns"
                        value={formData.concerns}
                        onChange={handleInputChange}
                        placeholder="e.g., acne, redness, hydration"
                    />
                </div>

                <button type="submit" className="recs-button" disabled={loading}>
                    {loading ? "Fetching..." : "Get Recommendations"}
                </button>
            </form>

            {/* Status Indicators */}
            {loading && <p className="recs-loading">Fetching recommendations... 🔄</p>}
            {error && <p className="recs-error">{error}</p>}

            {/* Results Area */}
            


            {/* Specific Product Recommendations */}
            {showProducts && (
                <div className="recs-results">
                    <h3 className="recs-subtitle">Top Skincare Picks ✨</h3>
                    <ul className="product-list">
                        {products.map((product, index) => (
                            <li key={product.id || product.product_name || index} className="product-item">
                                {product.product_image && (
                                    <img src={product.product_image} alt={product.product_name || 'Product Image'} className="product-image" />
                                )}
                                <div className="product-details">
                                    {/* Product Name */}
                                    <h3>{product.product_name || 'N/A'}</h3>

                                    {/* Product Price (Make sure product.price exists!) */}
                                    {/* Format the price as needed (e.g., add currency symbol) */}
                                    {typeof product.price !== 'undefined' && (
                                        <p className="product-price">${product.price.toFixed(2)}</p> // Example formatting
                                    )}

                                    {/* Hidden Details - Add the classes */}
                                    <p className="product-brand"><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                                    <p className="product-effect"><strong>Effect:</strong> {product.notable_effects || 'N/A'}</p>
                                    {product.product_url && (
                                        <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="product-link">View Product</a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                     {/* Decide how/when to show the Routine component */}
             {showRoutineComponent && <Routine skinType={formData.skinType} /* Pass defaultRoutine={defaultRoutine} if needed */ />}
                </div>
            )}

            {/* No Results Message */}
            {showNoResultsMessage && (
                 <p className="recs-no-results">No specific recommendations found for your criteria. Check the default routine above or try different options! 🧴</p>
             )}
        </div>
    );
};

export default Recs;