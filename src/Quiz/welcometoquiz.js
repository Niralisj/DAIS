import React from "react";
import { useNavigate } from "react-router-dom";
import "../Quiz/welcome.css";

const WelcomeScreen = () => {
  const navigate = useNavigate(); // ✅ Correct way to navigate

  return (
    <div className="welcome-screen">
      <h1>Welcome to the Skin Type Quiz</h1>
      <p>Discover your skin type and find the best skincare routine for you.</p>
      <p>Click the button below to start the quiz.</p>
      <button onClick={() => navigate("/quiz")} className="start-button fade-in">
        Start Quiz
      </button>
      
    </div>
  );
};

export default WelcomeScreen;
