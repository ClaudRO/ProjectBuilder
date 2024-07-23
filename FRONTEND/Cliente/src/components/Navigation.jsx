// Navigation.jsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../src/pages/css/Navigation.css'

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/crear-usuario";
  const isLoginPage2 = location.pathname === "/login2";
  const loggedIn = isAuthenticated();
  let userName = null;

  function isAuthenticated() {
    const accessToken = localStorage.getItem('access_token');
  
    if (accessToken) {
      const decodedToken = decodeAccessToken(accessToken);
      const expirationTime = decodedToken.exp * 1000;
  
      return expirationTime > Date.now();
    }
  
    return false;
  }

  function decodeAccessToken(accessToken) {
    const decodedToken = jwtDecode(accessToken);
    return decodedToken;
  }

  function handleLogout() {
    localStorage.removeItem('access_token');
    navigate("/login2");
  }

  if (loggedIn) {
    const decodedToken = decodeAccessToken(localStorage.getItem('access_token'));
    userName = decodedToken.sub; // Obtener el nombre de usuario del token decodificado
  }

  return (
    <>
      <div className='flex justify-center py-2'>
        <Link to="/inicio">
          <h1 className='font-bold text-3xl'>ProjectBu</h1>
        </Link>
      
      </div>
      <div>
        {!isLoginPage2 && (
        <>
          <h1>Bienvenido: {userName}<button className='px-3 rounded-lg' onClick={handleLogout}>Cerrar Sesión</button></h1>
        </>
        )}
      </div>

      <hr className="w-full border-t-2 border-gray-300 padding=auto" />

        <div className='py-2'>
          <div className='OpcionesPrincipales'>
            {!isLoginPage && !isLoginPage2 && loggedIn && (
              <>
                <button className='bg-indigo-500 px-10 py-2 rounded-lg'>
                  <Link to="/proyectos">Proyectos</Link>
                </button>
                <button className='bg-indigo-500 px-10 py-2 rounded-lg'>
                  <Link to="/clientes">Clientes</Link>
                </button>
                <button className='bg-indigo-500 px-10 py-2 rounded-lg'>
                  <Link to="/usuarios">Usuarios</Link>
                </button>
                
              </>
            )}
            
          </div>
      </div>    
    </>
  );
}