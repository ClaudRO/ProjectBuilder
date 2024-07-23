
import React, { useState } from 'react';


import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import '../css/LoginForm.css';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica de inicio de sesión
  };






  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className='font-bold uppercase text-center mb-8'>Ingresa tus credenciales</h1>
        <input
          type="text"
          placeholder="Correo electrónico o nombre de usuario"
          value={username}
          onChange={handleUsernameChange}
        />
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <button type="submit" className="submit-button">Iniciar sesión</button>
        <p className="text-center mt-4">
          ¿No tienes una cuenta?{' '}
          <Link to="/crear-usuario" className="text-blue-500 hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
