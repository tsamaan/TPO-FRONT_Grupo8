import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol especifico, verificar
  if (requiredRole) {
    const userRole = user?.role || user?.roles?.[0];
    
    if (requiredRole === 'ADMIN') {
      // Admin y SuperAdmin pueden acceder
      if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
        return <Navigate to="/perfil" replace />;
      }
    } else if (requiredRole === 'SUPERADMIN') {
      // Solo SuperAdmin puede acceder
      if (userRole !== 'SUPERADMIN') {
        return <Navigate to="/admin" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
