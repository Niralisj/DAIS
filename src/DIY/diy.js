import React, { useState } from "react";
import "./diy.css";
import teaimg from "./imgs/teaa.webp";
import lemonRoseImage from "./imgs/rose.jpg";
import aloe from "./imgs/aloe.jpg";

const DIYNavbar = () => {
  const scrollToSection = (id, event) => {
    event.preventDefault();
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="diy-navbar">
      <h1 className="logo">DIY Remedies</h1>
      <ul className="nav-links">
        <li><a href="#oily-skin" onClick={(e) => scrollToSection("oily-skin", e)}>Oily Skin</a></li>
        <li><a href="#dry-skin" onClick={(e) => scrollToSection("dry-skin", e)}>Dry Skin</a></li>
        <li><a href="#combination-skin" onClick={(e) => scrollToSection("combination-skin", e)}>Combination Skin</a></li>
        <li><a href="#sensitive-skin" onClick={(e) => scrollToSection("sensitive-skin", e)}>Sensitive Skin</a></li>
      </ul>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="About">
      <div className="diy-hero-content">
        <h2>🌿 Natural DIY Remedies</h2>
        <p>
          Welcome to our DIY skincare haven! Here, we believe that the best ingredients 
          for your skin come straight from nature. Whether you're dealing with dryness, 
          excess oil, or sensitivity, our carefully curated home remedies use simple, 
          effective ingredients to nourish and heal your skin.  
        </p>
        <p>
          From refreshing toners to exfoliating scrubs, discover a range of natural recipes 
          tailored to different skin types. Take control of your skincare with easy-to-make, 
          chemical-free solutions that leave your skin feeling fresh, glowing, and healthy. 
          Let’s get started on your journey to natural beauty! ✨  
        </p>
      </div>
      <div className="diy-hero-image"></div>
    </section>
  );
};

const oilySkinRecipes = [
  {
    title: "Green Tea & Honey Toner",
    description: "A soothing toner for oily skin.",
    ingredients: ["1 cup brewed green tea", "1 tbsp honey", "2 tbsp apple cider vinegar"],
    instructions: [
      "Brew green tea and let it cool.",
      "Mix with honey and apple cider vinegar.",
      "Store in a spray bottle and use as a toner after cleansing."
    ],
    image: teaimg
  },
  {
    title: "Lemon & Rosewater Toner",
    description: "A natural toner to reduce oil and tighten pores.",
    ingredients: ["2 tbsp rosewater", "1 tsp fresh lemon juice", "1 tbsp witch hazel (optional)"],
    instructions: [
      "Mix rosewater, lemon juice, and witch hazel in a small bottle.",
      "Shake well before use.",
      "Apply with a cotton pad or spray on the face after cleansing."
    ],
    image: lemonRoseImage
  },
  {
    title: "Aloe Vera & Lemon Gel",
    description: "A refreshing gel that controls excess oil.",
    ingredients: ["2 tbsp fresh aloe vera gel", "1 tsp lemon juice"],
    instructions: [
      "Mix aloe vera gel with lemon juice.",
      "Apply a thin layer on your face and leave for 10 minutes.",
      "Rinse off with cool water and pat dry."
    ],
    image: aloe
  }
];

const OilySkinSection = () => {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const toggleRecipe = (index) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  return (
    <section id="oily-skin" className="oily-skin-section">
      <h2>Oily Skin Remedies</h2>
      <div className="recipe-container">
        {oilySkinRecipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <h3 onClick={() => toggleRecipe(index)} className="recipe-title">
              {recipe.title}
            </h3>
            <p>{recipe.description}</p>
            {expandedRecipe === index && (
              <div className="recipe-details">
                <h4>Ingredients:</h4>
                <ul>
                  {recipe.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h4>Instructions:</h4>
                <ol>
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const DIY = () => {
  return (
    <>
      <DIYNavbar />
      <HeroSection />
      <OilySkinSection />
    </>
  );
};

export default DIY;
