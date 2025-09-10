import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If the authentication status is still being checked, show a loading message.
  // This prevents a brief flash of the login page for already-logged-in users on a page refresh.
  if (isLoading) {
    return <div className="container"><h1>Loading...</h1></div>;
  }

  // If the user is not authenticated, redirect them to the login page.
  // We also pass the original location they were trying to access, so we can redirect them back after login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child components (the actual protected page).
  return children;
};

export default ProtectedRoute;