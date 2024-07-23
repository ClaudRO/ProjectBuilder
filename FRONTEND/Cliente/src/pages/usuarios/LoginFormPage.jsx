import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import '../css/LoginFormPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons';
import { LoginUsuario } from '../../api/usuarios.api';
import toast from 'react-hot-toast';

const LoginFormPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        console.log("entro en hadnlelogin")
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);
            console.log("flag de las credenciales entregadas",formData)
            const response = await LoginUsuario(formData);
            toast.success('Credenciales validadas');
            // Guardar el token en localStorage
            localStorage.setItem('access_token', response.data.access_token);

            // Redireccionar al usuario a otra página
            // Por ejemplo, redireccionar a la página de inicio después del inicio de sesión
            
            window.location.href = '/proyectos';
        } catch (error) {
            toast.error('Error al iniciar sesión:', error);
            // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className='bodi'>
            <div className='wrapper'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input
                            type='text'
                            name='username'
                            placeholder='Correo electrónico'
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                        />
                        <FaUser className='icon' />
                    </div>

                    <div className='input-box'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            placeholder='Contraseña'
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                        />
                        <FontAwesomeIcon icon={showPassword ?  faLockOpen : faLock} className='icon'  onClick={() => setShowPassword(!showPassword)}/>
                        
                    </div>
                    
                    <div className='remember-forgot'>
                        <label>
                            <input type='checkbox' /> Recordarme
                        </label>
                        <a href='#'>¿Olvidaste tu contraseña ?</a>
                    </div>
                    <button type="submit">Login</button>

                    <div className='register-link'>
                        <p>¿No estás registrado? <a href='/crear-usuario'>Registrarse</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginFormPage;