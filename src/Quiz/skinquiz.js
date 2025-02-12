import React, { useState } from "react";
import "../Quiz/skinquiz.css";

const quizData = {
  title: "Skin Type Quiz",
  questions: [
    { question: "How does your skin feel after washing your face?", options: ["Tight and dry", "Oily", "Normal", "Both dry and oily"], category: ["dry", "oily", "normal", "combination"] },
    { question: "How often do you experience breakouts?", options: ["Rarely", "Frequently", "Sometimes", "Only in certain areas"], category: ["dry", "oily", "combination", "sensitive"] },
    { question: "What type of cleanser do you prefer?", options: ["Foam", "Cream", "Gel", "Oil-based"], category: ["oily", "dry", "combination", "sensitive"] },
    { question: "Does your skin feel greasy at the end of the day?", options: ["Yes", "No", "Sometimes", "Only in T-zone"], category: ["oily", "dry", "combination", "sensitive"] },
    { question: "Do you have visible pores?", options: ["Large and visible", "Small and barely visible", "Visible in some areas", "No idea"], category: ["oily", "dry", "combination", "sensitive"] },
    { question: "Does your skin feel itchy or irritated often?", options: ["Yes", "No", "Sometimes", "Only with certain products"], category: ["sensitive", "normal", "combination", "depends"] },
    { question: "How does your skin react to the sun?", options: ["Burns easily", "Tans easily", "Gets red but then tans", "No noticeable change"], category: ["sensitive", "normal", "combination", "varies"] },
    { question: "How does your skin feel in winter?", options: ["Dry and flaky", "Oily", "Normal", "Both dry and oily"], category: ["dry", "oily", "normal", "combination"] },
    { question: "Do you experience redness on your face?", options: ["Often", "Rarely", "Only after using certain products", "Never"], category: ["sensitive", "normal", "depends", "healthy"] },
    { question: "Do you get shiny skin by midday?", options: ["Yes", "No", "Sometimes", "Only in the T-zone"], category: ["oily", "dry", "combination", "depends"] },
    { question: "How does your skin feel when you wake up?", options: ["Oily", "Dry", "Normal", "Only T-zone is oily"], category: ["oily", "dry", "normal", "combination"] },
    { question: "Do you get blackheads or whiteheads frequently?", options: ["Yes", "No", "Only on the nose", "Occasionally"], category: ["oily", "normal", "combination", "depends"] },
    { question: "How does makeup sit on your skin?", options: ["Slips off easily", "Patches on dry areas", "Looks even", "Some areas are oily, some dry"], category: ["oily", "dry", "normal", "combination"] },
    { question: "Does your skin react to new skincare products?", options: ["No", "Yes, sometimes", "Yes, always", "Depends on the product"], category: ["normal", "sensitive", "very sensitive", "depends"] },
    { question: "Do you have a healthy glow without products?", options: ["Yes", "No", "Sometimes", "Only in summer"], category: ["normal", "dry", "combination", "depends"] }
  ]
};

const SkinQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState(""); // State for error message

  const handleSelectAnswer = (questionIndex, option, category) => {
    setAnswers({
      ...answers,
      [`${questionIndex}`]: category,
    });
  };

  const calculateResult = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== quizData.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError(""); // Clear error if all questions are answered

    const skinTypeCount = {};

    // Count occurrences of each skin type
    Object.values(answers).forEach((category) => {
      skinTypeCount[category] = (skinTypeCount[category] || 0) + 1;
    });

    // Find the most selected skin type
    const mostCommonSkinType = Object.keys(skinTypeCount).reduce((a, b) =>
      skinTypeCount[a] > skinTypeCount[b] ? a : b
    );

    setResult(mostCommonSkinType);
    setShowResult(true);
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{quizData.title}</h2>
      {quizData.questions.map((q, questionIndex) => (
        <div key={questionIndex} className="quiz-question">
          <p className="question-text">{q.question}</p>
          <div className="options-container">
            {q.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleSelectAnswer(questionIndex, option, q.category[optionIndex])}
                className={`quiz-option ${answers[`${questionIndex}`] === q.category[optionIndex] ? "selected" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="error-message">{error}</p>}

      <button onClick={calculateResult} className="final-button">
        Submit & Get Result
      </button>

      {showResult && (
        <div className="quiz-result">
          <h3>Your Skin Type: <span>{result}</span></h3>
        </div>
      )}
    </div>
  );
};

export default SkinQuiz;
