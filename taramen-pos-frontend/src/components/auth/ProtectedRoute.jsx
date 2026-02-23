import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("auth_token");
  const isAuthenticated = !!token;
  const userRaw = localStorage.getItem("auth_user");
  let user = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0) {
    const hasRequiredRole = user?.roles?.some(role => roles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
