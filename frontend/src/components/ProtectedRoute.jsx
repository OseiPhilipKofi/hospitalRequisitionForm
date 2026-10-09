import { Navigate } from 'react-router-dom';
import { dashboardPath, useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return <div className="grid min-h-screen place-items-center text-sm text-outline">Loading workspace…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }
  return children;
}
