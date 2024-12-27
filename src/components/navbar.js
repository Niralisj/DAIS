import React from "react";

const Navbar = () => {
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
      </ul>
    </nav>
  );
};

export default Navbar;
