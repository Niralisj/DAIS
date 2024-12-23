import React from 'react';
import ReactDOM from 'react-dom/client';

//import './index.css'; // Ensure global styles exist
import App from './App'; // Ensure App component is correctly implemented and exported
import { onCLS, onFID, onLCP } from 'web-vitals'; // Import performance metrics

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// For performance monitoring
// Pass a logging function or connect it to an analytics tool if needed
onCLS(console.log);  // Logs the Cumulative Layout Shift
onFID(console.log);  // Logs the First Input Delay
onLCP(console.log);  // Logs the Largest Contentful Paint
