const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);  // Cumulative Layout Shift
        getFID(onPerfEntry);  // First Input Delay
        getFCP(onPerfEntry);  // First Contentful Paint
        getLCP(onPerfEntry);  // Largest Contentful Paint
        getTTFB(onPerfEntry); // Time to First Byte
      })
      .catch((err) => {
        console.error('Failed to import web-vitals:', err); // Log the error
      });
  }
};

export default reportWebVitals;
