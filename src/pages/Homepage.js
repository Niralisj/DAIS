import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />

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

      {/* Skin Quiz Section */}
      <section id="skin-quiz" className="section skin-quiz">
        <div className="text-content">
          <h2>Skin Quiz</h2>
          <p>Take our personalized skin quiz to find out what works best for your skin.</p>
        </div>
      </section>

      {/* DIY Remedies Section */}
      <section id="diy-remedies" className="section diy-remedies">
        <div className="text-content">
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

      <Footer />
    </div>
  );
};

export default Homepage;
