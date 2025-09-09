import React from "react";
import "./footer.css";
//import { FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Branding */}
        <div className="footer-section">
          <h2 className="footer-title">Dais</h2>
          <p>Your virtual skincare friend</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">about</a></li>
            <li><a href="/recommendations">Recommendations</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">          
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Dais. Built and designed by ©<span className="nirali">Nirali</span>
               
      </div>
    </footer>
  );
};

export default Footer;
