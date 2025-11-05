
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "./RegisterForm.css";

const RegisterForm = ({ onShowLogin }) => {
  const navigate = useNavigate();
  const { register, error, isAuthenticated } = useContext(AuthContext);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [localError, setLocalError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!form.nombre || !form.apellido || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setLocalError("Todos los campos son obligatorios");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }
    setLocalError("");
    
    const result = await register(form);
    if (result) {
      setRegistrationSuccess(true);
    }
  };

  const handleSuccessConfirm = () => {
    setRegistrationSuccess(false);
    navigate('/login');
  };

  return (
    <div className="register-form-wrapper">
      <form className="register-form-card" onSubmit={handleSubmit}>
        <div className="register-form-header">
          <div className="register-form-title">Crear cuenta</div>
          <div className="register-form-subtitle">Únete a nuestra comunidad</div>
        </div>
        
        <div className="register-form-row">
          <div className="register-form-group">
            <label htmlFor="nombre" className="register-form-label">Nombre</label>
            <input 
              id="nombre" 
              name="nombre" 
              type="text" 
              className="register-form-input" 
              value={form.nombre} 
              onChange={handleChange} 
              placeholder="Tu nombre" 
              required 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="apellido" className="register-form-label">Apellido</label>
            <input 
              id="apellido" 
              name="apellido" 
              type="text" 
              className="register-form-input" 
              value={form.apellido} 
              onChange={handleChange} 
              placeholder="Tu apellido" 
              required 
            />
          </div>
        </div>

        <div className="register-form-group">
          <label htmlFor="email" className="register-form-label">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            className="register-form-input" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="tu@email.com" 
            required 
            autoComplete="email"
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="phone" className="register-form-label">Teléfono</label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            className="register-form-input" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder="+54 11 1234-5678" 
            required 
            autoComplete="tel"
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="password" className="register-form-label">Contraseña</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            className="register-form-input" 
            value={form.password} 
            onChange={handleChange} 
            placeholder="Mínimo 6 caracteres" 
            required 
            autoComplete="new-password"
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="confirmPassword" className="register-form-label">Confirmar contraseña</label>
          <input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            className="register-form-input" 
            value={form.confirmPassword} 
            onChange={handleChange} 
            placeholder="Repetir contraseña" 
            required 
            autoComplete="new-password"
          />
        </div>

        <div className="register-form-footer">
          <button type="submit" className="register-form-btn">
            Registrarse
          </button>
          <button 
            type="button" 
            className="register-home-btn" 
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>

        <div className="register-form-bottom">
          <span>¿Ya tenés cuenta?</span>
          <button 
            type="button" 
            className="register-form-link" 
            onClick={onShowLogin}
          >
            Iniciar sesión
          </button>
        </div>

        {localError && <div className="register-form-error">{localError}</div>}
        {error && !localError && <div className="register-form-error">{error}</div>}
      </form>

      {/* Modal de éxito */}
      {registrationSuccess && (
        <div className="register-modal-overlay">
          <div className="register-modal">
            <div className="register-modal-icon">✓</div>
            <h2 className="register-modal-title">¡Registro exitoso!</h2>
            <p className="register-modal-message">
              Tu cuenta ha sido creada correctamente. 
              Ahora podés iniciar sesión.
            </p>
            <button 
              className="register-modal-btn" 
              onClick={handleSuccessConfirm}
            >
              Ir al login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default RegisterForm;
