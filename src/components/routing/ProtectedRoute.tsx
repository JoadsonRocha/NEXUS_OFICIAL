import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/SupabaseProvider';
import { SystemLoadingScreen } from '../common/SystemLoadingScreen';

export const ComponentLoader = () => <SystemLoadingScreen />;

export function ProtectedRoute() {
  const { user, loading, forcePasswordChange, sessionLocked } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <ComponentLoader />;
  }

  // sessionLocked indicates an ongoing logout/lock; treat as unauthenticated
  const isLoggedIn = !!user && !sessionLocked;

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is logged in but needs to change password, redirect to change password page.
  if (forcePasswordChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // If user already changed password, prevent returning to change-password
  if (!forcePasswordChange && location.pathname === '/change-password') {
    return <Navigate to="/dashboard" replace />;
  }

  // Defensive navigation: if at any point the user becomes null, navigate to login
  // (useEffect avoided to keep component simple — immediate render logic handles this)

  return <Outlet />;
}
