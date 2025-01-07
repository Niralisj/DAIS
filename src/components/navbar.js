import React from "react";

const Navbar = ({ onUserIconClick }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">DAIS</div>
      <ul>
        <li>
          <button onClick={() => scrollToSection("home")}>Home</button>
        </li>
        <li>
          <button onClick={() => scrollToSection("skin-quiz")}>Skin Quiz</button>
        </li>
        <li>
          <button onClick={() => scrollToSection("diy-remedies")}>DIY Remedies</button>
        </li>
        <li>
          <button onClick={() => scrollToSection("chat-forum")}>Chat Forum</button>
        </li>
        <li>
          <button onClick={() => scrollToSection("learn-and-glow")}>Learn and Glow</button>
        </li>
      </ul>
      {/* User icon added here */}
      <div
        className="user-icon"
        onClick={onUserIconClick}
        style={{
          cursor: "pointer",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          fontSize: "1.5rem",
        }}
      >
        👤 {/* Replace this emoji with an actual icon or image */}
      </div>
    </nav>
  );
};

export default Navbar;
