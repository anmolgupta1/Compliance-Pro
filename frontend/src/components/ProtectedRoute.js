// components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute component for guarding routes that require authentication
 * @param {Object} props - Component props
 * @param {string[]} [props.allowedRoles] - Optional list of roles that are allowed to access this route
 * @returns {JSX.Element} The protected route component
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#EEEEEE'
        }}
      >
        <CircularProgress sx={{ color: '#76ABAE' }} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to dashboard or unauthorized page
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required role, render the route
  return <Outlet />;
};

export default ProtectedRoute;