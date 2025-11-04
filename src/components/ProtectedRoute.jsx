import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole) {
    const userRole = user?.role || user?.roles?.[0];
    
    if (requiredRole === 'ADMIN') {
      // Admin y SuperAdmin pueden acceder
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return <Navigate to="/perfil" replace />;
      }
    } else if (requiredRole === 'SUPER_ADMIN') {
      // Solo SuperAdmin puede acceder
      if (userRole !== 'SUPER_ADMIN') {
        return <Navigate to="/admin" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
