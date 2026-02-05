import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2Icon } from 'lucide-react';

export default function PublicRoute({ children, restricted = false }) {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && restricted) {
    return <Navigate to={from} replace />;
  }

  return children;
}
