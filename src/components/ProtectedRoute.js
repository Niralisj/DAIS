import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    const location = useLocation();

    // 1. If the auth state is still loading, don't render anything yet.
    //    This is the key fix. It waits for the useEffect in AuthContext
    //    or the login function to finish.
    if (loading) {
        // You can return a loading spinner here for better UX
        return <div>Loading...</div>; 
    }

    // 2. If it's done loading and there is NO token, redirect to login.
    if (!token) {
        // We pass the current location in state so the user can be
        // redirected back to the page they were trying to access after they log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If it's done loading and there IS a token, render the requested component.
    return children;
};

export default ProtectedRoute;