import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
import "./LoginForm.css";

const LoginForm = ({ onShowRegister }) => {
	const { login, error, isAuthenticated, user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(email, password);
	};

	// Redirigir segun el rol despues del login
	useEffect(() => {
		if (isAuthenticated && user) {
			const userRole = user.role || user.roles?.[0];
			
			if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
				navigate('/admin');
			} else {
				navigate('/perfil');
			}
		}
	}, [isAuthenticated, user, navigate]);

	const handleGoHome = () => {
		navigate('/');
	};

	return (
		<div className="login-form-wrapper">
			<form className="login-form-card" onSubmit={handleSubmit}>
				<div className="login-form-header">
					<div className="login-form-title">Iniciar sesion</div>
					<div className="login-form-subtitle">Accede a tu cuenta para continuar</div>
				</div>
				<div className="login-form-group">
					<label htmlFor="email" className="login-form-label">Email</label>
					<input
						id="email"
						type="email"
						className="login-form-input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Ingresa tu email"
						required
						autoComplete="email"
					/>
				</div>
				<div className="login-form-group">
					<label htmlFor="password" className="login-form-label">Contraseña</label>
					<input
						id="password"
						type="password"
						className="login-form-input"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Ingresa tu contraseña"
						required
						autoComplete="current-password"
					/>
				</div>
				{error && <div className="login-form-error">{error}</div>}
				<div className="login-form-footer">
					<button type="submit" className="login-form-btn">Iniciar sesion</button>
					<button type="button" className="login-home-btn" onClick={handleGoHome}>Volver al inicio</button>
				</div>
				<div className="login-form-bottom">
					<span>¿No tenes cuenta?</span>
					<button type="button" className="login-form-link" onClick={onShowRegister}>Registrate</button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
