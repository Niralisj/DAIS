import React, { useState, useCallback } from "react";
import "./recs.css";
import Routine from "./routine";

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const PRODUCT_TYPES = ["Cleanser", "Serum", "Moisturizer", "Sunscreen"];
const CATEGORIES = ["Indian", "Global"];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const Recs = () => {
    const [formData, setFormData] = useState({
        skinType: "",
        productType: "",
        category: "",
        concerns: "",
    });
    const [products, setProducts] = useState([]);
    const [defaultRoutine, setDefaultRoutine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleInputChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setProducts([]);
        setDefaultRoutine(null);
        setError("");
        setSearchPerformed(false);
    }, []);

    const fetchData = useCallback(async (url, isRoutineFetch = false) => {
        setLoading(true);
        setError("");
        setProducts([]);
        setDefaultRoutine(null);
        setSearchPerformed(true);

        try {
            console.log("Fetching from:", url);
            const response = await fetch(url);

            if (!response.ok) {
                let errorBody = 'Unknown error';
                try {
                    errorBody = await response.text();
                } catch (_) { }
                throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorBody}`);
            }

            const data = await response.json();

            if (isRoutineFetch) {
                setDefaultRoutine(data);
                setProducts([]);
            } else {
                setProducts(data);
                setDefaultRoutine(null);
            }

        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
            console.error("Fetch error details:", err);
            setProducts([]);
            setDefaultRoutine(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecommendations = useCallback(() => {
        const { skinType, productType, category, concerns } = formData;

        if (!skinType) {
            setError("Please select a skin type.");
            setSearchPerformed(false);
            return;
        }

        if (productType && category) {
            const queryParams = new URLSearchParams({
                skintype: skinType,
                product_type: productType.toLowerCase(),
                category: category.toLowerCase(),
            });
            if (concerns.trim()) {
                queryParams.append('concern', concerns.trim());
            }
            fetchData(`${API_BASE_URL}/recommendations?${queryParams.toString()}`, false);
        } else {
            fetchData(`${API_BASE_URL}/default_routine?skintype=${skinType}`, true);
        }
    }, [formData, fetchData]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        fetchRecommendations();
    }, [fetchRecommendations]);

    const renderSelectOptions = (options) => (
        options.map((option) => (
            <option key={option} value={option}>{option}</option>
        ))
    );

    const showProducts = !loading && products.length > 0;
    const showRoutineComponent = !loading && !!formData.skinType;
    const showNoResultsMessage = searchPerformed && !loading && !error && products.length === 0 && defaultRoutine === null;

    return (
        <div className="recs-container">
            <h2 className="recs-title">Product Recommendations</h2>

            <form onSubmit={handleSubmit} className="recs-form">
                <div className="form-group">
                    <label htmlFor="skinType">Skin Type:</label>
                    <select id="skinType" name="skinType" value={formData.skinType} onChange={handleInputChange} required>
                        <option value="">Select Skin Type</option>
                        {renderSelectOptions(SKIN_TYPES)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="productType">Product Type (for specific search):</label>
                    <select id="productType" name="productType" value={formData.productType} onChange={handleInputChange}>
                        <option value="">Select Product Type</option>
                        {renderSelectOptions(PRODUCT_TYPES)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category (for specific search):</label>
                    <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {renderSelectOptions(CATEGORIES)}
                    </select>
                </div>

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

            {loading && <p className="recs-loading">Fetching recommendations... 🔄</p>}
            {error && <p className="recs-error">{error}</p>}

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
                                    <h3>{product.product_name || 'N/A'}</h3>
                                    {typeof product.price !== 'undefined' && (
                                        <p className="product-price">${product.price.toFixed(2)}</p>
                                    )}
                                    <p className="product-brand"><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                                    <p className="product-effect"><strong>Effect:</strong> {product.notable_effects || 'N/A'}</p>
                                    {product.product_url && (
                                        <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="product-link">View Product</a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {showRoutineComponent && <Routine skinType={formData.skinType} />}
                </div>
            )}

            {showNoResultsMessage && (
                <p className="recs-no-results">No specific recommendations found for your criteria. Check the default routine above or try different options! 🧴</p>
            )}
        </div>
    );
};

export default Recs;