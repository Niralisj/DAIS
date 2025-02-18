import React from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer";
import "../Homepage/homepage.css";



const Homepage = () => {
  const navigate = useNavigate();
  // Function to handle clicks on the user icon
  const handleUserIconClick = () => {
    console.log("User icon clicked!");
    navigate('/login'); // Redirects to login page
    // Later, this can redirect to login/signup or open a dropdown menu
    
  };
    // Function to handle the skin quiz button click
    const handleQuizButtonClick = () => {
      console.log("Skin Quiz button clicked!");
      navigate('/skinquiz'); // Redirects to skin quiz page
    };
  return (
    <div className="homepage">
      {/* Pass the handler function to Navbar */}
      <Navbar onUserIconClick={handleUserIconClick} />
       
      

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="title-1">
          <h1>Self-Care Starts With Skin Care</h1>
          <p>
          Want to know how Dais works? Click below to learn more          </p>
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
    

    <div className="about-text">
      <h2>About Dais</h2>
      <p>
        At <strong>Dais</strong>, we believe that self-care starts with understanding your skin.  
        Whether you're dealing with breakouts, hyperpigmentation, or simply looking for the perfect skincare routine,  
        Dais provides expert-backed solutions tailored to your needs.
      </p>
      
      <ul className="about-features">
        <li><strong>Personalized Skincare</strong> – Get recommendations based on your skin type and concerns.</li>
        <li><strong>DIY Remedies</strong> – Explore natural and effective skincare solutions.</li>
        <li><strong>Community & Chat Forum</strong> – Connect with others and share your skincare journey.</li>
        <li><strong>Learn & Glow</strong> – Access skincare guides backed by science and expertise.</li>
      </ul>
      
      <p className="about-tagline"><strong></strong></p>

      <button 
        className="hero-btn" 
        onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}
      >
        Get Started
      </button>
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


      {/* Chat Forum Section */}
      <section id="chat-forum" className="chat-forum">
        <div className="chat">
          <h2>Chat Forum</h2>
          <p>Join our community to discuss skincare tips and tricks with others.</p>
        </div>
      </section>

       {/* Learn and Glow Section */}
       <section id="learn-and-glow" className="section learn-and-glow">
        <div className="lg">
         
          
          <div className="card-container">
            <div className="card">
              <img src="/path-to-image1.jpg" alt="Winter Base Makeup Routine" />
               <div class="card-content">
              <h3>My Winter Base Makeup Routine</h3>
                <p>Read more</p>
            </div>    
            </div>
            <div class="card">
    <img src="/path-to-image2.jpg" alt="Double Cleansing Guide" />
    <div class="card-content">
      <h3>The Ultimate Double Cleansing Guide For Every Skin Type</h3>
      <p>Read more</p>
    </div>   
  </div>

  <div class="card">
    <img src="/path-to-image3.jpg" alt="Face Serum Benefits" />
    <div class="card-content">
      <h3>10 Benefits Of Using A Face Serum In Your Skincare Routine</h3>
      <p>Read more</p>
    </div>  
  </div>

  <div class="card">
    <img src="/path-to-image4.jpg" alt="Blog Content" />
    <div class="card-content">
      <h3>Blog Content</h3>
      <p>Read more</p>
    </div>
  </div>

  <div class="card">
    <img src="/path-to-image5.jpg" alt="Blog Content" />
    <div class="card-content">
      <h3>Blog Content</h3>
      <p>Read more</p>
    </div>
  </div>

  <div class="card">
    <img src="/path-to-image6.jpg" alt="Blog Content" />
    <div class="card-content">
      <h3>Blog Content</h3>
      <p>Read more</p>
       </div>
    </div>




            
         
            
            

          
            
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}; 

export default Homepage;
