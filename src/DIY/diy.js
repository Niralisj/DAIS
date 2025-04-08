import React, { useState } from "react";
import "./diy.css";
import teaimg from "./imgs/teaa.webp";
import lemonRoseImage from "./imgs/rose.jpg";
import aloe from "./imgs/aloe.jpg";
import honeyMask from "./imgs/honey_mask.jpg";
import avocadoMask from "./imgs/avocado_mask.jpg";
import charcoalMask from "./imgs/charcoal_mask.jpg";
import rosewaterSpray from "./imgs/rosewater_spray.jpg";
import clayMask from "./imgs/clay_mask.jpg";
import bananaMask from "./imgs/banana_mask.jpg";
import oliveOil from "./imgs/olive_oil.jpg";
import sandalwood from "./imgs/sandalwood.jpg";
import calendula from "./imgs/calendula.jpg";
import fullersearth from "./imgs/fullersearth.jpg";
import chamomile from "./imgs/chamomile.jpg";

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

const HeroSection = () => (
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

const recipesBySkinType = {
  "oily-skin": [
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
    },
    {
      title: "Turmeric & Yogurt Mask",
      description: "Helps reduce inflammation and control oil.",
      ingredients: ["1 tsp turmeric powder", "2 tbsp plain yogurt"],
      instructions: ["Mix turmeric and yogurt.", "Apply to face for 15 minutes.", "Rinse with warm water."],
      image: null,
    },
    {
      title: "Apple Cider Vinegar Spot Treatment",
      description: "Targets blemishes and reduces oil production.",
      ingredients: ["1 part apple cider vinegar", "3 parts water"],
      instructions: ["Dilute ACV with water.", "Apply with cotton swab to blemishes.", "Leave for 5-10 minutes, rinse."],
      image: null,
    },
    {
      title: "Charcoal & Clay Mask",
      description: "Deeply cleanses pores and absorbs excess oil.",
      ingredients: ["1 tbsp activated charcoal powder", "1 tbsp bentonite clay", "Water or apple cider vinegar"],
      instructions: ["Mix charcoal and clay.", "Add water or ACV to form a paste.", "Apply to face, avoiding eyes, for 10-15 mins.", "Rinse thoroughly."],
      image: charcoalMask,
    },
    {
      title: "Tomato Pulp Mask",
      description: "Reduces oiliness and brightens skin.",
      ingredients: ["1 ripe tomato (mashed)"],
      instructions: ["Mash the tomato pulp.", "Apply to face for 15-20 minutes.", "Rinse with cool water."],
      image: null,
    },
    {
      title: "Fuller's Earth (Multani Mitti) Mask",
      description: "Absorbs excess oil and impurities.",
      ingredients: ["2 tbsp Fuller's Earth", "Water or rosewater"],
      instructions: ["Mix Fuller's Earth with water or rosewater to form a smooth paste.", "Apply to face and neck.", "Leave until dry and rinse with warm water."],
      image: fullersearth,
    },
    {
      title: "Egg White Mask",
      description: "Tightens pores and reduces oil.",
      ingredients: ["1 egg white", "1 tsp lemon juice (optional)"],
      instructions: ["Whisk the egg white until slightly frothy.", "Add lemon juice if using.", "Apply to face and let it dry.", "Rinse with warm water."],
      image: null,
    },
  ],
  "dry-skin": [
    {
      title: "Oatmeal & Honey Mask",
      description: "Hydrates and soothes dry skin.",
      ingredients: ["2 tbsp oatmeal", "1 tbsp honey", "2 tbsp warm water"],
      instructions: [
        "Mix oatmeal with warm water to form a paste.",
        "Add honey and mix well.",
        "Apply to face and leave for 15 minutes before rinsing."
      ],
      image: honeyMask,
    },
    {
      title: "Avocado & Olive Oil Mask",
      description: "Deeply moisturizes dry skin.",
      ingredients: ["1/2 ripe avocado", "1 tbsp olive oil"],
      instructions: [
        "Mash avocado and mix with olive oil.",
        "Apply to face and leave for 20 minutes.",
        "Rinse with warm water."
      ],
      image: avocadoMask,
    },
    {
      title: "Honey & Yogurt Mask",
      description: "Hydrating and gentle mask.",
      ingredients: ["1 tbsp plain yogurt", "1 tbsp honey"],
      instructions: ["Mix yogurt and honey.", "Apply to face for 15 minutes.", "Rinse with warm water."],
      image: honeyMask,
    },
    {
      title: "Coconut Oil Moisturizer",
      description: "Intense moisture for very dry skin.",
      ingredients: ["1 tbsp coconut oil"],
      instructions: ["Apply a thin layer to face and body.", "Use after shower for best results."],
      image: null,
    },
    {
      title: "Rosehip Oil Serum",
      description: "Helps with skin regeneration and hydration.",
      ingredients: ["Pure rosehip oil"],
      instructions: ["Apply a few drops to face at night.", "Massage gently."],
      image: lemonRoseImage,
    },
    {
      title: "Milk & Almond Oil Cleanser",
      description: "Gently cleanses and moisturizes dry skin.",
      ingredients: ["2 tbsp milk", "1 tsp almond oil"],
      instructions: ["Mix milk and almond oil.", "Apply to face and massage gently.", "Wipe off with a damp cloth."],
      image: null,
    },
    {
      title: "Shea Butter Balm",
      description: "Provides intense hydration for very dry areas.",
      ingredients: ["Pure shea butter"],
      instructions: ["Warm a small amount in your hands and apply to dry areas like elbows, knees, and face."],
      image: null,
    },
    {
      title: "Banana & Honey Mask",
      description: "Nourishes and moisturizes dry and dull skin.",
      ingredients: ["1/2 ripe banana (mashed)", "1 tbsp honey"],
      instructions: ["Mash the banana and mix with honey.", "Apply to face for 15 minutes.", "Rinse with warm water."],
      image: bananaMask,
    },
    {
      title: "Olive Oil & Egg Yolk Mask",
      description: "Rich in moisture and helps to soften skin.",
      ingredients: ["1 egg yolk", "1 tsp olive oil"],
      instructions: ["Whisk the egg yolk and mix in the olive oil.", "Apply to face and leave for 15-20 minutes.", "Rinse with lukewarm water."],
      image: oliveOil,
    },
  ],
  "combination-skin": [
    {
      title: "Cucumber & Aloe Toner",
      description: "Balances oil and hydrates.",
      ingredients: ["1/2 cucumber (blended)", "2 tbsp aloe vera gel"],
      instructions: ["Blend cucumber and mix with aloe vera.", "Apply with cotton pad.", "Use daily."],
      image: aloe,
    },
    {
      title: "Green Tea & Clay Mask",
      description: "Cleanses oily areas, soothes dry.",
      ingredients: ["1 tbsp green clay", "2 tbsp brewed green tea"],
      instructions: [
        "Mix clay with green tea to form a paste.",
        "Apply to oily areas, avoid dry areas.",
        "Leave for 10 minutes, rinse."
      ],
      image: clayMask,
    },
    {
      title: "Honey & Jojoba Oil Serum",
      description: "Balances moisture levels.",
      ingredients: ["1 tsp honey", "1 tsp jojoba oil"],
      instructions: ["Mix honey and jojoba oil.", "Apply a thin layer to face.", "Use at night."],
      image: honeyMask,
    },
    {
      title: "Yogurt & Strawberry Mask",
      description: "Exfoliates gently and balances moisture.",
      ingredients: ["2 tbsp plain yogurt", "2 mashed strawberries"],
      instructions: ["Mix yogurt and mashed strawberries.", "Apply to face for 15 minutes.", "Rinse."],
      image: null,
    },
    {
      title: "Aloe Vera & Cucumber Gel",
      description: "Soothes and hydrates both oily and dry areas.",
      ingredients: ["2 tbsp aloe vera gel", "2 tbsp cucumber juice"],
      instructions: ["Mix aloe vera gel and cucumber juice.", "Apply to face for 10 minutes.", "Rinse."],
      image: aloe,
    },
    {
      title: "Rosewater & Witch Hazel Toner",
      description: "Tones and balances combination skin.",
      ingredients: ["2 tbsp rosewater", "1 tbsp witch hazel"],
      instructions: ["Mix rosewater and witch hazel.", "Apply with a cotton pad after cleansing."],
      image: rosewaterSpray,
    },
    {
      title: "Gentle Sugar Scrub (for dry patches)",
      description: "Exfoliates dry areas gently.",
      ingredients: ["1 tbsp sugar (fine)", "1 tsp olive oil or honey"],
      instructions: ["Mix sugar with olive oil or honey.", "Gently scrub dry areas in circular motions.", "Rinse with warm water."],
      image: null,
    },
    {
      title: "Sandalwood & Rosewater Mask",
      description: "Soothes and balances both oily and dry parts.",
      ingredients: ["1 tbsp sandalwood powder", "Rosewater (enough to make a paste)"],
      instructions: ["Mix sandalwood powder with rosewater to form a smooth paste.", "Apply to face, avoiding the eye area.", "Leave on for 15-20 minutes, then rinse."],
      image: sandalwood,
    },
    {
      title: "Tomato & Honey Mask",
      description: "Helps with oil control in the T-zone and hydrates drier areas.",
      ingredients: ["1/2 ripe tomato (mashed)", "1 tsp honey"],
      instructions: ["Mash the tomato and mix with honey.", "Apply to face, focusing on the T-zone if needed.", "Leave on for 15 minutes, then rinse."],
      image: null,
    },
  ],
  "sensitive-skin": [
    {
      title: "Chamomile Tea Toner",
      description: "Soothes and calms sensitive skin.",
      ingredients: ["1 cup brewed chamomile tea"],
      instructions: ["Brew chamomile tea and let it cool.", "Apply with cotton pad.", "Use daily."],
      image: chamomile,
    },
    {
      title: "Aloe Vera Gel",
      description: "Reduces irritation and redness.",
      ingredients: ["Pure aloe vera gel"],
      instructions: ["Apply a thin layer to irritated areas.", "Use as needed."],
      image: aloe,
    },
    {
      title: "Oatmeal & Milk Mask",
      description: "Gentle and calming mask.",
      ingredients: ["2 tbsp finely ground oatmeal", "2 tbsp milk"],
      instructions: ["Mix oatmeal and milk to form a paste.", "Apply to face for 10 minutes.", "Rinse with warm water."],
      image: null,
    },
    {
      title: "Honey & Coconut Oil Mask",
      description: "Nourishes and soothes without irritation.",
      ingredients: ["1 tbsp honey", "1 tsp coconut oil"],
      instructions: ["Mix honey and coconut oil.", "Apply to face for 10 minutes.", "Rinse."],
      image: honeyMask,
    },
    {
      title: "Cucumber & Yogurt Soothing Mask",
      description: "Reduces redness and cools the skin.",
      ingredients: ["2 tbsp plain yogurt", "2 tbsp grated cucumber"],
      instructions: ["Mix yogurt and grated cucumber.", "Apply to face for 10 minutes.", "Rinse."],
      image: null,
    },
    {
      title: "Rosewater Spray",
      description: "Gently hydrates and calms sensitive skin.",
      ingredients: ["Pure rosewater"],
      instructions: ["Spray directly onto the face as needed throughout the day."],
      image: rosewaterSpray,
    },
    {
      title: "Plain Yogurt Mask",
      description: "A simple and gentle mask to soothe sensitive skin.",
      ingredients: ["Plain, unsweetened yogurt"],
      instructions: ["Apply a thin layer of plain yogurt to your face.", "Leave on for 10-15 minutes.", "Rinse with cool water."],
      image: null,
    },
    {
      title: "Calendula Infused Oil",
      description: "Helps to soothe and heal sensitive and irritated skin.",
      ingredients: ["Calendula infused oil (or a carrier oil infused with dried calendula flowers)"],
      instructions: ["Apply a few drops to clean skin and gently massage in.", "Use as a moisturizer or to soothe specific areas."],
      image: calendula,
    },
    {
      title: "Green Tea Compress",
      description: "Reduces redness and inflammation.",
      ingredients: ["Brewed and cooled green tea", "Soft cotton pads or cloth"],
      instructions: ["Steep a green tea bag in hot water, let it cool completely.", "Soak cotton pads or a soft cloth in the cooled tea.", "Apply to the face for 5-10 minutes."],
      image: teaimg,
    },
  ],
};

const SkinTypeSection = ({ title, recipes, id, showImage = false }) => {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const toggleRecipe = (index) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  return (
    <section id={id} className={`${id}-section`}>
      <h2>{title}</h2>
      <div className="recipe-container">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            {showImage && recipe.image && (<img src={recipe.image} alt={recipe.title} className="recipe-image" />)}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipesBySkinType);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filterRecipes = (recipes) => {
      return Object.keys(recipes).reduce((acc, skinType) => {
        const filtered = recipes[skinType].filter(recipe =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
        );
        if (filtered.length > 0) {
          acc[skinType] = filtered;
        }
        return acc;
      }, {});
    };

    setFilteredRecipes(filterRecipes(recipesBySkinType));
  };

  return (
    <>
      <DIYNavbar />
      <HeroSection />

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search remedies..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {Object.keys(filteredRecipes).map(skinType => (
        <SkinTypeSection
          key={skinType}
          title={`${skinType.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Remedies`}
          recipes={filteredRecipes[skinType]}
          id={skinType}
          showImage={true}
        />
      ))}
    </>
  );
};

export default DIY;