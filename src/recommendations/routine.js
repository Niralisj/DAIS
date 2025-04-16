import React, { useState } from 'react';
import './routine.css'; 

const skincareRoutines = {
  "oily": [
    { step: 1, category: "Cleanser", description: "Use a foaming cleanser with salicylic acid." },
    { step: 2, category: "Toner", description: "Apply an oil-control toner with AHA/BHA." },
    { step: 3, category: "Moisturizer", description: "Use a lightweight, oil-free moisturizer." },
    { step: 4, category: "Sunscreen", description: "Apply a non-comedogenic sunscreen." },
  ],
  "dry": [
    { step: 1, category: "Cleanser", description: "Use a hydrating cream cleanser." },
    { step: 2, category: "Toner", description: "Apply a hydrating toner with hyaluronic acid." },
    { step: 3, category: "Moisturizer", description: "Use a rich, emollient moisturizer." },
    { step: 4, category: "Sunscreen", description: "Apply a moisturizing sunscreen." },
  ],
  "combination": [
    { step: 1, category: "Cleanser", description: "Use a gentle foaming or gel cleanser." },
    { step: 2, category: "Toner", description: "Apply a balancing toner." },
    { step: 3, category: "Moisturizer", description: "Use a lightweight moisturizer, focusing on dry areas." },
    { step: 4, category: "Sunscreen", description: "Apply a broad-spectrum sunscreen." },
  ],
  "sensitive": [
    { step: 1, category: "Cleanser", description: "Use a fragrance-free, gentle cleanser." },
    { step: 2, category: "Toner", description: "Apply a soothing toner with minimal ingredients." },
    { step: 3, category: "Moisturizer", description: "Use a hypoallergenic, calming moisturizer." },
    { step: 4, category: "Sunscreen", description: "Apply a mineral sunscreen." },
  ],
  "normal": [
    { step: 1, category: "Cleanser", description: "Use a gentle cleanser suitable for daily use." },
    { step: 2, category: "Toner", description: "Apply a balancing toner." },
    { step: 3, category: "Moisturizer", description: "Use a balanced, hydrating moisturizer." },
    { step: 4, category: "Sunscreen", description: "Apply a broad-spectrum sunscreen." },
  ],
};

const Routine = () => {
  const [skinType, setSkinType] = useState('oily'); 

  const renderSkincareRoutine = () => {
    const routine = skincareRoutines[skinType];

    if (!routine) {
      return <p>No skincare routine found for this skin type.</p>;
    }

    return (
      <div className="skincare-routine-container">
        <h2>Your Skincare Routine ({skinType})</h2>
        <ol>
          {routine.map((item) => (
            <li key={item.step}>
              <strong>{item.category}:</strong> {item.description}
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <div>
      <select value={skinType} onChange={(e) => setSkinType(e.target.value)}>
        <option value="oily">Oily</option>
        <option value="dry">Dry</option>
        <option value="combination">Combination</option>
        <option value="sensitive">Sensitive</option>
        <option value="normal">Normal</option>
      </select>
      {renderSkincareRoutine()}
    </div>
  );
};

export default Routine;