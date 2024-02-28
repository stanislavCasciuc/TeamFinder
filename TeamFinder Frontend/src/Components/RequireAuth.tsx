import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
    allowedRoles?: string[];
    }

const RequireAuth = ({allowedRoles}:RequireAuthProps) => {
  const {auth }= useAuth();
  const location = useLocation();
  return auth?.role && allowedRoles?.includes(auth?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/Login" state={{ from: location }} replace />
  );
};  

export default RequireAuth;
