import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BeginQuiz.css";

const SurveyForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        skincareExperience: "",
        gender: "",
        skincareTime: "",
        skinConcerns: []
    });

    const [error, setError] = useState("");

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setError("");
    };

    const handleCheckboxChange = (value) => {
        setFormData(prev => {
            const updatedConcerns = prev.skinConcerns.includes(value)
                ? prev.skinConcerns.filter(c => c !== value)
                : [...prev.skinConcerns, value];
            return { ...prev, skinConcerns: updatedConcerns };
        });
    };

    const handleSubmit = () => {
        const { skincareExperience, gender, skincareTime, skinConcerns } = formData;

        if (!skincareExperience || !gender || !skincareTime || skinConcerns.length === 0) {
            setError("⚠️ Please complete all questions before continuing!");
            return;
        }

        navigate("/FindSkinType", { state: formData });
    };

    return (
        <>
            {/* Heading outside the survey container */}
            <div className="survey-heading">
                <h2 className="heading">Tell us about yourself</h2>
            </div>
    
            {/* Survey container starts here */}
            <div className="survey-container">
                <p className="survey-subtext">
                    We’ll personalize your skincare journey based on your answers!
                </p>
    
                <div className="survey-form">
                    {error && <p className="error-message">{error}</p>}
    
                    <label>
                        Have you ever done skincare before?
                        <select onChange={(e) => handleInputChange("skincareExperience", e.target.value)}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="I just started">I just started</option>
                        </select>
                    </label>
    
                    <label>
                        What is your gender?
                        <select onChange={(e) => handleInputChange("gender", e.target.value)}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </label>
    
                    <label>
                        How much time do you spend on skincare daily?
                        <select onChange={(e) => handleInputChange("skincareTime", e.target.value)}>
                            <option value="">Select</option>
                            <option value="Less than 5 minutes">Less than 5 minutes</option>
                            <option value="5-10 minutes">5-10 minutes</option>
                            <option value="10+ minutes">10+ minutes</option>
                            <option value="I don't do skincare">I don't do skincare</option>
                        </select>
                    </label>
    
                    <div className="question">
                        <p>Do you have any specific skin concerns?</p>
                        <div className="checkbox-group">
                            {["Acne", "Dryness", "Oiliness", "Sensitivity", "None"].map(option => (
                                <label key={option}>
                                    <input 
                                        type="checkbox" 
                                        value={option} 
                                        onChange={() => handleCheckboxChange(option)} 
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
    
                    <div className="submit">
                        <p>By clicking "Start Quiz", you agree to our <a href="terms">Terms</a> and <a href="terms">Privacy Policy</a>.</p>
                        <button onClick={handleSubmit}>Start Quiz</button>
                    </div>
                </div>
    
                <p className="survey-footer">Your skincare journey starts here! 🌿</p>
            </div>
        </>
    );
}    

export default SurveyForm;
