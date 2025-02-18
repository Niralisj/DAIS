import React from "react";
import "../navbar/navbar.css";

const Navbar = ({ onUserIconClick }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
     <div className="logo">
</div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><button onClick={() => scrollToSection("home")}>Home</button></li>
        <li><button onClick={() => scrollToSection("skin-quiz")}>Skin Quiz</button></li>
        <li><button onClick={() => scrollToSection("diy-remedies")}>DIY Remedies</button></li>
        <li><button onClick={() => scrollToSection("learn-and-glow")}>Learn & Glow</button></li>
        <li><button onClick={() => scrollToSection("chat-forum")}>Chat Forum</button></li>
      </ul>

      {/* User Icon */}
      <div className="user-icon" onClick={onUserIconClick}>
        👤 {/* Replace with an actual icon/image if needed */}
      </div>
    </nav>
  );
};

export default Navbar;
