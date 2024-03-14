import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const isAuthorized =
    auth?.roles && auth.roles.map((role:string) => allowedRoles.includes(role));

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
