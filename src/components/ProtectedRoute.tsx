import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from './LoadingState';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="min-h-screen sky-gradient flex items-center justify-center"><LoadingState /></div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
};
