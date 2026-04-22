import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If not logged in, redirect to home page (login popup will appear from there)
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // If logged in, show the dashboard
  return children;
}

export default ProtectedRoute;