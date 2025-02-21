import React from "react";
import { useNavigate } from "react-router-dom";
import "../Quiz/welcome.css";
import FractalTree from "./FT";


const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <h1>Welcome to Skin Type Quiz</h1>
      <p> 
        Take our quick quiz to discover your skin type and get tailored recommendations just for you!
      </p>

     <button onClick={() => navigate("/quiz")} className="start-button fade-in">
        Start Quiz
      </button>

      {/* Cute Moving Fractal Tree Below Button */}
      <div className="tree-container">
        <FractalTree />
      </div>


      <div className="already-know">
        <p>Already know your skin type?</p>
        <button onClick={() => navigate("/recs")} className="skip-button">
          Take me to recommendations
        </button>
        <p className="info-text-p">
          Get personalized product suggestions, skincare routines, and friendly reminders  
          to help you stay consistent with your skincare journey. ✨
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;

