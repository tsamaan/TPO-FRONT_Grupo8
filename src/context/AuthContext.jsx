import React, { useState, createContext, useEffect } from "react";
import { loginService, registerService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Recuperar sesión del localStorage al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    const result = await loginService(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setUser(result.user);
      setError("");
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setError(result.message);
    }
  };

  const register = async (data) => {
    const result = await registerService(data);
    if (result.success) {
      setError("");
      return true;
    } else {
      setError(result.message);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role);
  };

  // Verificar si es admin o superadmin
  const isAdmin = () => {
    return hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  };

  // Verificar si es superadmin
  const isSuperAdmin = () => {
    return hasRole('SUPER_ADMIN');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout,
      error, 
      setIsAuthenticated, 
      setUser,
      hasRole,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
