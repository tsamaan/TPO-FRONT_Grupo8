import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./LoginForm.css";

const LoginForm = ({ onShowRegister }) => {
	const { login, error, isAuthenticated } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className="login-form-wrapper">
			<form className="login-form-card" onSubmit={handleSubmit}>
				<div className="login-form-title">Iniciar sesión</div>
				<div className="login-form-group">
					<label htmlFor="email" className="login-form-label">Email</label>
					<input
						id="email"
						type="email"
						className="login-form-input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Ingresá tu email"
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
						placeholder="Ingresá tu contraseña"
						required
						autoComplete="current-password"
					/>
				</div>
				<div className="login-form-footer">
					<button type="submit" className="login-form-btn">Iniciar sesión</button>
				</div>
				<div className="login-form-bottom">
					<span>¿No tenés cuenta?</span>
					<button type="button" className="login-form-link" onClick={onShowRegister}>Registrate</button>
				</div>
				{error && <div className="login-form-error">{error}</div>}
				{isAuthenticated && <div className="login-form-success">¡Bienvenido a Haversack!</div>}
			</form>
		</div>
	);
};

export default LoginForm;
