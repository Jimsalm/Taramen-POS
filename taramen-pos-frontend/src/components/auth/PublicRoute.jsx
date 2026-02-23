import { Navigate, useLocation } from 'react-router-dom';

export default function PublicRoute({ children, restricted = false }) {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const isAuthenticated = !!localStorage.getItem("auth_token");

  if (isAuthenticated && restricted) {
    return <Navigate to={from} replace />;
  }

  return children;
}
