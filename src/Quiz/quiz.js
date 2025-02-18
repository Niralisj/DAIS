import React, { useState } from 'react';
import "../Quiz/quiz.css";

function SkinTypeQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [responses, setResponses] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState('');

  
  const [selectedOptions, setSelectedOptions] = useState({
    gender: "",
    skincareExperience: "",
    skincareTime: "",
    skinConcern: "",
  });
  const [error, setError] = useState('');

  const handleResponseChange = (questionIndex, value) => {
    setResponses({
      ...responses,
      [questionIndex]: value,
    });
  };

  const handleSelect = (key, value) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartQuiz = () => {
    if (Object.values(selectedOptions).includes("")) {
      setError("⚠️ Please answer all the questions before starting the quiz.");
      return;
    }
    setError("");
    setQuizStarted(true);
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(responses).length === questions[selectedOptions.gender].length) {
      setQuizCompleted(true);
      analyzeSkinType();
    } else {
      setError("⚠️ Please answer all the quiz questions before submitting.");
    }
  };
  const analyzeSkinType = () => {
    let dryCount = 0, oilyCount = 0, comboCount = 0;
  
    Object.values(responses).forEach((answer) => {
      if (answer.includes("dry")) dryCount++;
      if (answer.includes("oily")) oilyCount++;
      if (answer.includes("both") || answer.includes("T-zone")) comboCount++;
    });
  
    let determinedSkinType = "Normal";
    if (dryCount > oilyCount && dryCount > comboCount) determinedSkinType = "Dry";
    else if (oilyCount > dryCount && oilyCount > comboCount) determinedSkinType = "Oily";
    else if (comboCount > dryCount && comboCount > oilyCount) determinedSkinType = "Combination";
  
    setResult(determinedSkinType); // ✅ Now result is just "Oily", "Dry", etc.
  };
  

  // Determine skin type image and description based on the result
const skinTypeData = {
  "Oily": { 
    image: "/images/oily-skin.jpg", 
    description: "Your skin produces excess oil. Use oil-free and mattifying products." 
  },
  "Dry": { 
    image: "/images/dry-skin.jpg", 
    description: "Your skin lacks moisture. Hydration and deep moisturization are key!" 
  },
  "Combination": { 
    image: "/images/combination-skin.jpg", 
    description: "Your skin is a mix of oily and dry. Balance is important for your routine." 
  },
  "Sensitive": { 
    image: "/images/sensitive-skin.jpg", 
    description: "Your skin is prone to irritation. Use gentle, fragrance-free products." 
  },
  "Normal": { 
    image: "/images/normal-skin.jpg", 
    description: "Your skin is well-balanced. Keep up with a simple skincare routine!" 
  }
};

// Fetch the corresponding image and description
const skinTypeImage = skinTypeData[result]?.image || "/images/default.jpg";
const skinTypeDescription = skinTypeData[result]?.description || "Your skin type analysis is complete!";



  const questions = {
    male: [
      {
        q: "How does your skin feel after washing your face?",
        options: ["Tight and dry", "Smooth and normal", "Shiny and greasy", "Dry in some areas, oily in others"]
      },
      {
        q: "Does your skin get oily within a few hours of washing?",
        options: ["No, it stays dry all day", "Sometimes, only in the T-zone", "Yes, my whole face gets oily", "Only in hot weather"]
      },
      {
        q: "Do you experience frequent acne breakouts?",
        options: ["Rarely or never", "Occasionally", "Yes, very often", "Only in certain areas"]
      },
      {
        q: "How often do you use moisturizer?",
        options: ["Never", "Once a day", "Multiple times a day", "Only when my skin feels dry"]
      },
      {
        q: "Do you have large pores on your nose and forehead?",
        options: ["Not really", "A few visible ones", "Yes, they are large", "Only in some areas"]
      },
      {
        q: "How does your skin react to the sun?",
        options: ["Gets red and burns easily", "Tans slightly but no issues", "Gets very oily and sweaty", "Becomes dry and flaky"]
      },
      {
        q: "Does your skin feel greasy by the middle of the day?",
        options: ["No, it stays normal", "Only in my T-zone", "Yes, my whole face gets oily", "Only in hot or humid weather"]
      },
      {
        q: "Do you experience dryness in cold weather?",
        options: ["Yes, all over my face", "Only on some parts", "Not really, my skin stays normal", "No, my skin stays oily"]
      },
      {
        q: "Does your skin look dull or lifeless?",
        options: ["Yes, it always looks dry", "Sometimes, but not often", "No, it looks shiny but not dull", "Only when I don't use moisturizer"]
      },
      {
        q: "How often do you wash your face in a day?",
        options: ["Once a day", "Twice a day", "Multiple times a day", "Only when needed"]
      },
      {
        q: "Does your skin feel tight or uncomfortable after cleansing?",
        options: ["Yes, very tight and dry", "Sometimes, depends on the cleanser", "No, it feels fine", "Feels oily instead of tight"]
      },
      {
        q: "Do you use skincare products specifically for oily or dry skin?",
        options: ["No, I use random products", "Yes, I use dry-skin products", "Yes, I use oily-skin products", "I only use basic products like face wash"]
      },
      {
        q: "Do you get breakouts after using new skincare products?",
        options: ["Never", "Sometimes", "Very often", "Only with certain ingredients"]
      },
      {
        q: "Does your skin easily become red or irritated?",
        options: ["Yes, very sensitive", "Sometimes, but not often", "No, it’s fine", "Only when exposed to harsh weather"]
      },
      {
        q: "What happens when you don’t apply moisturizer for a day?",
        options: ["My skin gets dry and flaky", "It feels normal", "My skin gets very oily", "Some areas get dry, others get oily"]
      }
    ],
    female: [
      {
        q: "How does your skin feel in the morning before applying any product?",
        options: ["Very dry and tight", "Soft and smooth", "Shiny and oily", "Dry on cheeks, oily on forehead"]
      },
      {
        q: "Does your skin get oily in the T-zone?",
        options: ["Not at all", "Sometimes", "Yes, very quickly", "Only in hot weather"]
      },
      {
        q: "Do you get acne around your menstrual cycle?",
        options: ["Never", "Rarely", "Almost every time", "Only in certain spots"]
      },
      {
        q: "How often do you use a sheet mask or face mask?",
        options: ["Never", "Once a month", "Once a week", "Every few days"]
      },
      {
        q: "Do you experience dryness around your cheeks?",
        options: ["Always", "Sometimes", "Never", "Only in winter"]
      },
      {
        q: "How does your skin react to makeup products?",
        options: ["No reaction, works fine", "Sometimes irritates my skin", "Causes breakouts often", "Feels dry and flaky"]
      },
      {
        q: "Do you have large pores visible on your cheeks or forehead?",
        options: ["Not really", "A few visible ones", "Yes, they are large", "Only in certain areas"]
      },
      {
        q: "Does your skin feel dehydrated even after applying moisturizer?",
        options: ["Yes, always", "Sometimes", "No, it feels fine", "Only in cold weather"]
      },
      {
        q: "Do you prefer gel-based or cream-based skincare products?",
        options: ["Gel-based, I hate greasy products", "Cream-based, my skin needs hydration", "Either works fine", "I don’t use skincare products"]
      },
      {
        q: "How does your skin feel after a long day outside?",
        options: ["Dry and rough", "Normal, no change", "Oily and greasy", "Some areas dry, some oily"]
      },
      {
        q: "Do you get breakouts after using sunscreen?",
        options: ["Never", "Sometimes", "Very often", "Only with certain brands"]
      },
      {
        q: "How often do you exfoliate your skin?",
        options: ["Never", "Once a month", "Once a week", "Every few days"]
      },
      {
        q: "Does your skin feel itchy or irritated during seasonal changes?",
        options: ["Always", "Sometimes", "Rarely", "Never"]
      },
      {
        q: "Do you drink enough water daily?",
        options: ["Yes, at least 8 glasses", "Sometimes, not consistently", "Rarely, I forget", "Only when I feel thirsty"]
      },
      {
        q: "What happens when you don’t apply moisturizer for a day?",
        options: ["My skin gets dry and flaky", "It feels normal", "My skin gets very oily", "Some areas get dry, others get oily"]
      }
    ]
  };

  return (
    <div className="quiz">
      <h1>Welcome to the Skin Type Quiz</h1>
  
      {!quizStarted ? (
        // Intro Section
        <div className="quiz-container">
          <div className="quiz-start">
            <h2>Have you ever done skincare before?</h2>
            <div className="button-group1">
              {["Yes", "No", "I just started"].map((option) => (
                <label key={option} className={`btn ${selectedOptions.skincareExperience === option ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="skincareExperience"
                    value={option}
                    checked={selectedOptions.skincareExperience === option}
                    onChange={() => handleSelect("skincareExperience", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
  
            <h2>What is your gender?</h2>
            <div className="button-group1">
              {["male", "female"].map((option) => (
                <label key={option} className={`btn ${selectedOptions.gender === option ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={selectedOptions.gender === option}
                    onChange={() => handleSelect("gender", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
  
            <h2>How much time do you spend on skincare daily?</h2>
            <div className="button-group1">
              {["Less than 5 minutes", "5-10 minutes", "10+ minutes", "I don't do skincare"].map((option) => (
                <label key={option} className={`btn ${selectedOptions.skincareTime === option ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="skincareTime"
                    value={option}
                    checked={selectedOptions.skincareTime === option}
                    onChange={() => handleSelect("skincareTime", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
  
            <h2>Do you have any specific skin concerns?</h2>
            <div className="button-group1">
              {["Acne", "Dryness", "Oiliness", "Sensitivity", "None"].map((option) => (
                <label key={option} className={`btn ${selectedOptions.skinConcern === option ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="skinConcern"
                    value={option}
                    checked={selectedOptions.skinConcern === option}
                    onChange={() => handleSelect("skinConcern", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
  
            {error && <p className="error-message">{error}</p>}
  
            <button onClick={handleStartQuiz} className="start-quiz-btn">
              Start Quiz
            </button>
          </div>
        </div>
      ) : quizCompleted ? (
        
    
        <>
          {/* Result Section */}
          <div className="quiz-completed">
            <h1>Skin Type Analysis</h1>
            <p>
              Based on your answers, your skin type is <strong>{result}</strong>.
            </p>
            <p>
              Understanding your skin type helps in choosing the right skincare routine. 
              Keep exploring to find what works best for you!
            </p>
          </div>
        </>
      

        
      ) : (
        // Quiz Questions Section
        <div className="quiz-questions">
          <div className="class2">
            {selectedOptions.gender && questions[selectedOptions.gender] ? (
              questions[selectedOptions.gender].map((question, index) => (
                <div key={index} className="question-quiz">
                  {index < 4 && <h3>{question.q}</h3>}
                  <div className="button-group2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className={`btn ${responses[index] === option ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={responses[index] === option}
                          onChange={() => handleResponseChange(index, option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>Error: No questions available. Please restart the quiz.</p>
            )}
  
            {error && <p className="error-message">{error}</p>}
  
            <button onClick={handleSubmitQuiz} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
}
export default SkinTypeQuiz;


