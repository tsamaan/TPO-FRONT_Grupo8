
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "../LoginForm/LoginForm.css";

const RegisterForm = ({ onShowLogin }) => {
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
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onShowLogin();
      }, 1200);
    }
  }, [isAuthenticated, onShowLogin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleSubmit = (e) => {
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
    register(form);
  };

  return (
    <div className="login-form-wrapper">
      <form className="login-form-card" onSubmit={handleSubmit}>
        <div className="login-form-title">Crear cuenta</div>
        <div className="login-form-row">
          <div className="login-form-group" style={{ flex: 1 }}>
            <label htmlFor="nombre" className="login-form-label">Nombre</label>
            <input id="nombre" name="nombre" type="text" className="login-form-input" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
          </div>
          <div className="login-form-group" style={{ flex: 1 }}>
            <label htmlFor="apellido" className="login-form-label">Apellido</label>
            <input id="apellido" name="apellido" type="text" className="login-form-input" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
          </div>
        </div>
        <div className="login-form-group">
          <label htmlFor="email" className="login-form-label">Email</label>
          <input id="email" name="email" type="email" className="login-form-input" value={form.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="login-form-group">
          <label htmlFor="phone" className="login-form-label">Teléfono</label>
          <input id="phone" name="phone" type="text" className="login-form-input" value={form.phone} onChange={handleChange} placeholder="Teléfono" required />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-form-label">Contraseña</label>
          <input id="password" name="password" type="password" className="login-form-input" value={form.password} onChange={handleChange} placeholder="Contraseña" required />
        </div>
        <div className="login-form-group">
          <label htmlFor="confirmPassword" className="login-form-label">Repetir contraseña</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="login-form-input" value={form.confirmPassword} onChange={handleChange} placeholder="Repetir contraseña" required />
        </div>
        <div className="login-form-footer">
          <button type="submit" className="login-form-btn">Registrarse</button>
        </div>
        <div className="login-form-bottom">
          <span>¿Ya tenés cuenta?</span>
          <button type="button" className="login-form-link" onClick={onShowLogin}>Iniciar sesión</button>
        </div>
        {localError && <div className="login-form-error">{localError}</div>}
        {error && !localError && <div className="login-form-error">{error}</div>}
  {showSuccess && <div className="login-form-success">¡Registro exitoso!</div>}
      </form>
    </div>
  );
};


export default RegisterForm;
