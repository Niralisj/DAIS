import reportWebVitals from './reportWebVitals'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Only one BrowserRouter here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Report web vitals (log to console for now)
reportWebVitals((metric) => {
  console.log(metric); // You can replace this with custom logic to send metrics to an analytics service
});
