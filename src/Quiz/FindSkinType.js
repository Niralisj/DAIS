import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./fst.css";

const quizData = [
    {
      question: "How does your skin feel when you wake up in the morning?",
      options: [
        "Oily or greasy, especially on the T-zone.",
        "Normal, balanced, not too dry or oily.",
        "Dry or tight, sometimes flaky.",
        "Red, irritated, or itchy in some areas."
      ]
    },
    {
      question: "How does your skin feel after washing with a gentle cleanser?",
      options: [
        "Becomes oily again quickly.",
        "Feels clean and comfortable.",
        "Feels tight, dry, or slightly rough.",
        "Feels sensitive, red, or slightly burning."
      ]
    },
    {
      question: "How does your skin look by the middle of the day without makeup?",
      options: [
        "Shiny or greasy all over.",
        "Still fresh and normal.",
        "Dry, dull, or flaky in some areas.",
        "Red or irritated in certain areas."
      ]
    },
    {
      question: "How often do you experience breakouts (pimples, acne, clogged pores)?",
      options: [
        "Very often, especially on my forehead, nose, and chin.",
        "Occasionally, maybe before my period.",
        "Rarely, almost never.",
        "My skin reacts with redness rather than breakouts."
      ]
    },
    {
      question: "How visible are your pores, especially around your nose and cheeks?",
      options: [
        "Very large and noticeable, especially in the T-zone.",
        "Medium-sized, but not too visible.",
        "Small and barely noticeable.",
        "Pores aren’t too visible, but my skin is often red or irritated."
      ]
    },
    {
      question: "How does your skin feel after applying a lightweight moisturizer?",
      options: [
        "Greasy and shiny soon after application.",
        "Feels hydrated and comfortable.",
        "Still feels dry, like it needs more moisture.",
        "Sometimes stings or turns red after applying."
      ]
    },
    {
      question: "How does your skin react to new skincare products?",
      options: [
        "Often gets oily or causes breakouts.",
        "Usually no reaction, my skin adapts well.",
        "Feels dry or tight with some products.",
        "Turns red, stings, or gets irritated easily."
      ]
    },
    {
      question: "How does your skin feel in hot, humid weather?",
      options: [
        "Extremely oily and shiny.",
        "Feels normal, not too oily or dry.",
        "Still feels dry, maybe a bit irritated.",
        "Feels itchy or reacts to heat with redness."
      ]
    },
    {
      question: "How does your skin feel in cold, dry weather?",
      options: [
        "Still oily but less than usual.",
        "Feels normal, with slight dryness.",
        "Very dry, rough, or flaky.",
        "Becomes extra sensitive and red."
      ]
    },
    {
      question: "What best describes your skin's overall texture?",
      options: [
        "Smooth but oily and sometimes bumpy.",
        "Soft and even, not too oily or dry.",
        "Rough, flaky, or tight in some areas.",
        "Easily irritated with redness or small bumps."
      ]
    },
    {
      question: "How does your makeup last throughout the day?",
      options: [
        "Gets greasy quickly and melts off.",
        "Lasts well with minimal touch-ups.",
        "Cracks or looks patchy due to dryness.",
        "Sometimes burns or reacts when I apply makeup."
      ]
    },
    {
      question: "Do you experience sensitivity to fragrances or skincare ingredients?",
      options: [
        "Not really, my skin is pretty tolerant.",
        "Sometimes, but not always.",
        "Rarely, my skin can handle most products.",
        "Yes, my skin often reacts with redness or burning."
      ]
    },
    {
      question: "How does your skin feel when you don’t apply any skincare products?",
      options: [
        "Oily and greasy, especially in the T-zone.",
        "Feels normal, no major issues.",
        "Tight, dry, or uncomfortable.",
        "Becomes red, itchy, or irritated."
      ]
    },
    {
          question: "How does your skin react to prolonged sun exposure without sunscreen?",
          options: [
            "Becomes extremely oily and shiny.",
            "Gets a tan but stays balanced.",
            "Feels tight, dry, or starts peeling.",
            "Turns red, burns easily, or gets irritated."
          ]
        },
        {
          question: "Which of these best describes how your skin feels at the end of the day?",
          options: [
            "Very greasy, especially on my forehead and nose.",
            "Feels the same as in the morning, balanced.",
            "Dry, flaky, or tight, needing more moisture.",
            "Red, irritated, or itchy, especially in some areas."
          ]
        }
      ];
  
      const getSkinDescription = (skinType) => {
        const descriptions = {
          Oily:
            "Your skin produces excess oil throughout the day, leading to shine and occasional breakouts. Consider using oil-free, mattifying products to help balance your skin.",
          Normal:
            "Your skin is well-balanced and healthy. A consistent skincare routine can maintain your natural glow without too many concerns.",
          Dry:
            "Your skin often feels tight and may appear flaky, indicating a need for extra hydration. Look for rich moisturizers with ingredients like hyaluronic acid and ceramides.",
          Sensitive:
            "Your skin tends to react with redness or irritation. It’s best to use gentle, fragrance-free, and soothing products to avoid further irritation."
        };
        return descriptions[skinType] || "For a more accurate assessment, please consult with a skincare professional.";
      };
      
      const calculateSkinType = (answers) => {
        const counts = { Oily: 0, Normal: 0, Dry: 0, Sensitive: 0 };
      
        answers.forEach((answer) => {
          if (answer === 0) counts.Oily++;
          else if (answer === 1) counts.Normal++;
          else if (answer === 2) counts.Dry++;
          else if (answer === 3) counts.Sensitive++;
        });
      
        let skinType = "Oily";
        let maxCount = counts.Oily;
      
        for (const type in counts) {
          if (counts[type] > maxCount) {
            maxCount = counts[type];
            skinType = type;
          }
        }
        return skinType;
      };
      
      export default function FindYourSkinType() {
        const [answers, setAnswers] = useState(Array(quizData.length).fill(null));
        const [currentQuestion, setCurrentQuestion] = useState(0);
        const [result, setResult] = useState(null);
        const [warning, setWarning] = useState(""); // custom warning message state
        const navigate = useNavigate();
      
        // Clear warning message after 3 seconds
  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const handleSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === null) {
      setWarning("Please select an option before proceeding! ✨");
      return;
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      setWarning("Oops! You missed some questions. Please answer all before submitting. 💖");
      return;
    }
    const skinType = calculateSkinType(answers);
    setResult(skinType);
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Find Your Skin Type</h1>
      {warning && <div className="warning-message">{warning}</div>}
      {result ? (
        <div className="result-section">
          <h3>Your Skin Type:</h3>
          <p className="result-text">{result.toUpperCase()}</p>
          <p className="skin-description">{getSkinDescription(result)}</p>
          <button
            className="btn restart-btn"
            onClick={() => {
              setResult(null);
              setAnswers(Array(quizData.length).fill(null));
              setCurrentQuestion(0);
            }}
          >
            Restart Quiz
          </button>
          <div className="recommendation-section">
            <p className="recs-text">
              Discover the perfect skincare routine curated just for your unique skin type.
              Our personalized product recommendations are designed to help you achieve balanced,
              radiant, and healthy skin every day. Click the button below to explore your tailored
              skincare solutions!
            </p>
            <button className="btn go-to-recs-btn" onClick={() => navigate("/Recs")}>
              Get Product Recommendations
            </button>
          </div>
          <div className="popup-message">
            Skincare is self-care, bestie! 💕 Let’s get you glowing! ✨
          </div>
        </div>
      ) : (
        <div className="quiz-box">
          <p className="question-count">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
          <div className="question-content">
            <p className="question-text">{quizData[currentQuestion].question}</p>
            <div className="options-list">
              {quizData[currentQuestion].options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  className={`option-btn ${answers[currentQuestion] === oIndex ? "selected" : ""}`}
                  onClick={() => handleSelect(oIndex)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="btn-group">
            <button className="btn prev-btn" disabled={currentQuestion === 0} onClick={handlePrev}>
              ◀ Previous
            </button>
            {currentQuestion === quizData.length - 1 ? (
              <button className="btn submit-btn" onClick={handleSubmit}>
                ✅ See My Skin Type
              </button>
            ) : (
              <button className="btn next-btn" onClick={handleNext}>
                Next ▶
              </button>
            )}
          </div>
        </div>
      )}
      <div className="floating-tips">
        <p>💡 Tip: Your skin type can change over time. Revisit this quiz periodically.</p>
      </div>
    </div>
  );
}