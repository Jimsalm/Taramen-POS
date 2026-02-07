import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2Icon } from 'lucide-react';

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );
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
