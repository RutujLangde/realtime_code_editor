import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authCookie");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
