import axios from 'axios';

const usuariosApi = axios.create({
    baseURL: 'http://localhost:8000'
});

const usuariosApi2 = axios.create({
    baseURL: 'http://localhost:8000/api/'
});

// Obtener el token de localStorage
const token = localStorage.getItem('access_token');

// Agregar el token a las cabeceras de autorización para todas las solicitudes
usuariosApi.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

usuariosApi2.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllUsuarios = () => usuariosApi.get('/usuarios/');
export const getUsuarioById = (id) => usuariosApi.get(`/usuario/${id}/`);
export const crearUsuario = (usuario) => usuariosApi.post('/crear_usuario/', usuario);
export const eliminarUsuario = (id) => usuariosApi.delete(`/${id}`);
export const actualizarUsuario = (id, usuario) => usuariosApi.put(`/actualizar_usuario/${id}/`, usuario);
export const getCargos = () => usuariosApi.get('/cargos/');
export const getPrivilegios = () => usuariosApi2.get('privilegios');

export const LoginUsuario = (credenciales) => usuariosApi.post('/token', credenciales);
