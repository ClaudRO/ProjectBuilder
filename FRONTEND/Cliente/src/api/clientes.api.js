import axios from 'axios';

const clientesApi = axios.create({
    baseURL: 'http://localhost:8000'
});

const clientesApi2 = axios.create({
    baseURL: 'http://localhost:8000/api/'
});

// Obtener el token de localStorage
const token = localStorage.getItem('access_token');

// Agregar el token a las cabeceras de autorización para todas las solicitudes
clientesApi.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const getAllClientes = () => clientesApi.get('/clientes/');
export const getClienteById = (id) => clientesApi.get(`/cliente/${id}/`);
export const crearCliente = (cliente) => clientesApi.post('/crear_cliente/', cliente);
export const eliminarCliente = (id) => clientesApi.delete(`/${id}`);
export const actualizarCliente = (id, cliente) => clientesApi.put(`/actualizar_cliente/${id}/`, cliente);
