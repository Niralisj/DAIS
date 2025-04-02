import React from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer";
import "../Homepage/homepage.css";
import img1 from "./blogimg/img1.jpg";
import img2 from "./blogimg/img2.jpg";
import img3 from "./blogimg/img3.jpg"; 
import img4 from "./blogimg/img4.jpg";
import img5 from "./blogimg/img5.jpg";
import img6 from "./blogimg/img6.jpg";
<source src="/one.mp4" type="video/mp4" />




const Homepage = () => {
  
  const navigate = useNavigate();
  const handleUserIconClick = () => {
    console.log("User icon clicked!");
    navigate('/login'); // Redirects to login page
    
    
  };
    const handleQuizButtonClick = () => {
      console.log("Skin Quiz button clicked!");
      navigate('/skinquiz'); // Redirects to skin quiz page
  };
  const handleRemindersIconClick = () => {
    console.log("Reminders icon clicked!");
    navigate('/reminder')
    
  };
  return (
    <div className="homepage">
      <Navbar onUserIconClick={handleUserIconClick}
      onRemindersIconClick={handleRemindersIconClick}
       />
      

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="title-1">
          <h1>Self-Care Starts With Skin Care</h1>
          <p>
          Want to know how Dais works? Click below to learn more  </p>
          <button className="hero-button"
            onClick={() =>
            document.getElementById("about")
            .scrollIntoView({ behavior: "smooth" })}>
            Explore Dais
          </button>
        </div>
      </section>




      {/* About Section */}
         <section id="about" className="about">
      <div className="about-container">
          <div className="about-video-container">
          <video autoPlay loop muted playsInline controls className="about-video">
            <source src="/one.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="about-text">
          <h2>About Dais</h2>
          <p>
            At <strong>Dais</strong>, we believe self-care starts with understanding your skin.
            Whether you're dealing with breakouts, hyperpigmentation, or looking for the perfect skincare routine,
            Dais provides expert-backed solutions tailored to your needs.
          </p>

        </div>
      </div>
    </section>
   
         
      {/* Skin Quiz Section */}
<section id="skin-quiz" className="section skin-quiz">
  <div className="text-content">
  <h2>Discover What’s Best for Your Skin!</h2>
   <h3>Take our personalized skin quiz to find out what works best for your skin.</h3>
    <button className="b1" onClick={handleQuizButtonClick}>
      Take the Quiz
    </button>
  </div>
      </section>
      





      {/* DIY Remedies Section */}
           <section id="diy-remedies" className="diy-remedies">
          <div className="diy-content">
          <h2>Mix, Glow, Repeat!🍯</h2>
          <p>Explore easy-to-make remedies for healthy, glowing skin.Make skincare fun with easy, nourishing DIY beauty hacks</p>
          <a href="/diy" className="diy-btn">Explore Remedies</a>
          </div>
          </section>


      
      {/* Learn and Glow Section */}
      <section id="learn-and-glow" className="section learn-and-glow">
  <div className="card-container">
  <div className="card">
      <img src={img1} alt="Glowing Winter Skin Routine" />
      <div className="card-content">
        <h3>How to Achieve Glowing Skin in Winter</h3>
        <p>Say goodbye to dull, dry skin! Discover the best products and techniques to keep your skin radiant all winter.</p>
        <a href="https://www.nykaa.com/beauty-blog/tips-and-routines-to-get-glowing-skin-this-winter/" target="_blank" rel="noopener noreferrer" className="read-more">
          <p>Read more</p>
        </a>
      </div>    
    </div>

    <div className="card">
      <img src={img2} alt="Double Cleansing Guide" />
      <div className="card-content">
        <h3>Mastering the Double Cleansing Method</h3>
        <p>Is double cleansing really necessary? Learn how it helps remove sunscreen, makeup, and dirt effectively.</p>
        <a href="https://www.nykaa.com/beauty-blog/how-to-double-clean-your-face/" target="_blank" rel="noopener noreferrer" className="read-more">
          <p>Read more</p>
        </a>
      </div>   
    </div>

    <div className="card">
      <img src={img3} alt="Face Serum Benefits" />
      <div className="card-content">
        <h3>10 Reasons Why Face Serums Are a Must-Have</h3>
        <p>Not sure if serums are worth it? See how they transform your skin and which ones suit your needs.</p>
        <a href="https://www.nykaa.com/beauty-blog/benefits-of-face-serum/" target="_blank" rel="noopener noreferrer" className="read-more">
          <p>Read more</p>
        </a>
      </div>  
    </div>

    <div className="card">
            <div className="card-content">
            <img src={img4} alt="correct order" />
    <h3>The Correct Order to Apply Skincare Products</h3>
    <p>Ever wondered if moisturizer goes before or after serum? Get the ultimate layering guide.</p>
    <a href="https://www.healthline.com/health/beauty-skin-care/order-of-skin-care#quick-guide" target="_blank" rel="noopener noreferrer" className="read-more">
      <p>Read more</p>
    </a>
  </div>
</div>

<div className="card">
            <div className="card-content">
            <img src={img5} alt="Winter Base Makeup Routine" />

    <h3>Why Sunscreen is the Most Important Skincare Product</h3>
    <p>SPF is a must-have, but do you know which type is best for your skin? Find out here.</p>
    <a href="https://www.garnier.in/skin-care-tips/why-is-spf-important" target="_blank" rel="noopener noreferrer" className="read-more">
      <p>Read more</p>
    </a>
  </div>
</div>

<div className="card">
            <div className="card-content">
            <img src={img6} alt="Winter Base Makeup Routine" />

    <h3>How to Prevent and Treat Hyperpigmentation</h3>
    <p>Dark spots and uneven skin tone? Learn the best ways to fade them for good.</p>
    <a href="https://olay.co.uk/skin-care-tips/dark-spots-and-hyperpigmentation/how-to-reduce-hyperpigmentation" target="_blank" rel="noopener noreferrer" className="read-more">
      <p>Read more</p>
    </a>
  </div>
          </div>
        </div>
</section>

<section id="chat-forum" className="chat-forum">
  <div className="chat-container">
    <h2 className="chat-title">Join the Chat Forum</h2>
    <p className="chat-description">
      Connect with our community to share and explore skincare tips, tricks, and experiences.
    </p>
    <button className="chat-button" onClick={() => navigate("/cf/pages/dashboard")}>
  Join Now
</button>
  </div>
</section>




      <Footer />
    </div>
  );
}; 

export default Homepage;
