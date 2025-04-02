import React from "react";
import "../navbar/navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the user icon
import { FaBell } from 'react-icons/fa';

const Navbar = ({ onUserIconClick, onRemindersIconClick }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo"></div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><button onClick={() => scrollToSection("home")}>Home</button></li>
        <li><button onClick={() => scrollToSection("skin-quiz")}>Skin Quiz</button></li>
        <li><button onClick={() => scrollToSection("diy-remedies")}>DIY Remedies</button></li>
        <li><button onClick={() => scrollToSection("learn-and-glow")}>Learn & Glow</button></li>
        <li><button onClick={() => scrollToSection("chat-forum")}>Chat Forum</button></li>
      </ul>

      {/* User Icon */}
      <div className="icon-container">
        <div className="reminders-icon" onClick={onRemindersIconClick}>
          <FaBell />
        </div>
        <div className="user-icon" onClick={onUserIconClick}>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;