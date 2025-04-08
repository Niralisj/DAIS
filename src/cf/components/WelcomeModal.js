import React from 'react';
import "../style/9.css"; 

function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    // Use classes from 9.css
    <div className="welcome-modal-overlay">
      <div className="welcome-modal-container">
        <div className="welcome-modal-panel">
          <div className="welcome-modal-header">
            <h2 className="welcome-modal-title">Welcome to ForumFlow!</h2>
            <button onClick={onClose} className="welcome-modal-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="welcome-modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="welcome-modal-content">
            <p className="welcome-modal-description">
               This template is provided by <span className="welcome-modal-author">Xinghan Pan</span>. Here's how you can customize it:
            </p>
            <ul className="welcome-modal-list">
               <li>Update categories in the Sidebar component</li>
               <li>Modify the color scheme in tailwind classes (or your CSS)</li>
               <li>Add new features using the existing component structure</li>
               <li>Customize the header and branding</li>
            </ul>
            <div className="welcome-modal-actions">
              <button
                onClick={onClose}
                className="welcome-modal-got-it-button"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;