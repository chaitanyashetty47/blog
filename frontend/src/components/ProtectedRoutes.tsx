import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect them to the /signin page if there is no token
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};