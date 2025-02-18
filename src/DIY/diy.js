import React from "react";
import "./diy.css"; // Make sure to create this CSS file for styling

const diyRemedies = [
  {
    id: 1,
    title: "Honey & Turmeric Face Mask",
    description: "Mix 1 tbsp honey with 1/2 tsp turmeric. Apply for 10 minutes and rinse.",
  },
  {
    id: 2,
    title: "Aloe Vera & Rosewater Toner",
    description: "Mix equal parts aloe vera gel and rosewater. Use as a refreshing toner.",
  },
  {
    id: 3,
    title: "Oatmeal & Yogurt Scrub",
    description: "Blend 2 tbsp oatmeal with 1 tbsp yogurt. Gently scrub and rinse.",
  },
];

const DIY = () => {
  return (
    <section className="diy-container">
      <h2>🌿 DIY Remedies</h2>
      <p>Try these simple and natural skincare recipes at home!</p>
      
      <div className="diy-list">
        {diyRemedies.map((remedy) => (
          <div key={remedy.id} className="diy-card">
            <h3>{remedy.title}</h3>
            <p>{remedy.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DIY;
