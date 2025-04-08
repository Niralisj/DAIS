const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);  
        getFID(onPerfEntry); 
        getFCP(onPerfEntry);  
        getLCP(onPerfEntry);  
        getTTFB(onPerfEntry); 
      })
      .catch((err) => {
        console.error('Failed to import web-vitals:', err); // Log the error
      });
  }
};

export default reportWebVitals;
