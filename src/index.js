import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals'; 
import { BrowserRouter } from 'react-router-dom';
//import 'react-toastify/ReactToastify.css';
import { AuthProvider } from './context/AuthContext'; 




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// Report web vitals (log to console for now)
reportWebVitals((metric) => {
  console.log(metric); 
});
