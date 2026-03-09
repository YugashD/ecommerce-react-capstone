import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

// Protects any page that requires login
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={`/auth/login?reDirectTo=${location.pathname}`} replace />;
  }

  return children;
};

export default PrivateRoute;
