import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

// Protects pages that require admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/auth/login" replace />;
  if (role !== 'admin') return <Navigate to="/home" replace />;

  return children;
};

export default AdminRoute;
