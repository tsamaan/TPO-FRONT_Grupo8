import React from 'react';
import RegisterForm from '../components/auth/RegisterForm/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <RegisterForm onShowLogin={() => navigate('/login')} />
    </div>
  );
};

export default RegisterPage;
