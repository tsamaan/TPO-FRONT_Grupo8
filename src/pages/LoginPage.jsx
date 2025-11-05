import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm/LoginForm';
import RegisterForm from '../components/auth/RegisterForm/RegisterForm';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const [showRegister, setShowRegister] = useState(location.pathname === '/registro');
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setShowRegister(location.pathname === '/registro');
  }, [location.pathname]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div>
      {showRegister ? (
        <RegisterForm onShowLogin={() => navigate('/login')} />
      ) : (
        <LoginForm onShowRegister={() => navigate('/registro')} />
      )}
    </div>
  );
};

export default LoginPage;