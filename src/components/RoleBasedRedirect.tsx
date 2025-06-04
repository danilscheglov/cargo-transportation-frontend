import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'CLIENT':
      return <Navigate to="/my-orders" />;
    case 'MECHANIC':
      return <Navigate to="/add-vehicle" />;
    case 'DRIVER':
      return <Navigate to="/assigned-orders" />;
    case 'DISPATCHER':
      return <Navigate to="/requests" />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};

export default RoleBasedRedirect;
