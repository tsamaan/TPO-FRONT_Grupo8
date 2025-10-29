import React, { useState, createContext } from "react";
import { loginService, registerService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    const result = await loginService(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setUser(result.user);
      setError("");
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, error, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
