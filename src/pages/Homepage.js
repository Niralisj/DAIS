import React from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  // Function to handle clicks on the user icon
  const handleUserIconClick = () => {
    console.log("User icon clicked!");
    navigate('/login'); // Redirects to login page
    // Later, this can redirect to login/signup or open a dropdown menu
  };

  return (
    <div className="homepage">
      {/* Pass the handler function to Navbar */}
      <Navbar onUserIconClick={handleUserIconClick} />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Self-Care Starts With Skin Care</h1>
          <p>
            <i>Your skin deserves the best care with expert-backed solutions.</i>
          </p>
          <button className="hero-button">Get Started</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <div className="text">
          <h2>About Us</h2>
          <p>
            At Dais, we believe that skincare is a form of self-care. We provide
            personalized skincare solutions to help you achieve healthy, glowing
            skin.
          </p>
        </div>
        </section>

      {/* Skin Quiz Section */}
      <section id="skin-quiz" className="section skin-quiz">
        <div className="text-content">
          <h2>Skin Quiz</h2>
          <p>Take our personalized skin quiz to find out what works best for your skin.</p>
        </div>
      </section>

      {/* DIY Remedies Section */}
      <section id="diy-remedies" className="section diy-remedies">
        <div className="diy">
          <h2>DIY Remedies</h2>
          <p>Explore easy-to-make remedies for healthy, glowing skin.</p>
        </div>
      </section>

      {/* Chat Forum Section */}
      <section id="chat-forum" className="section chat-forum">
        <div className="text-content">
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


            <div className="card">
              <img src="/path-to-image2.jpg" alt="Double Cleansing Guide" />
              <div class="card-content">
              <h3>The Ultimate Double Cleansing Guide For Every Skin Type</h3>
                <p>Read more</p>
            </div>   
            </div>


            <div className="card">
              <img src="/path-to-image3.jpg" alt="Face Serum Benefits" />
              <div class="card-content">
              <h3>10 Benefits Of Using A Face Serum In Your Skincare Routine</h3>
                <p>Read more</p>
              </div>  
            </div>

            <div className="card">
              <img src="/path-to-image4.jpg" alt="" />
              <div class="card-content">
                <h3>blog content </h3>
                <p> read more </p>
              </div>
            </div>

            
            <div className="card">
              <img src="/path-to-image4.jpg" alt="" />
              <div class="card-content">
                <h3>blog content </h3>
                <p> read more </p>
              </div>
            </div>

            
            <div className="card">
              <img src="/path-to-image4.jpg" alt="" />
              <div class="card-content">
                <h3>blog content </h3>
                <p> read more </p>
              </div>21111
            </div>
            
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Homepage;
