import { Navigate } from 'react-router-dom';
import { LOGIN } from '@/shared/constants/routes';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('auth_token');

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to={LOGIN.path} replace />;
  }

  // Otherwise, render the dashboard/protected content
  return element;
};

export default ProtectedRoute;