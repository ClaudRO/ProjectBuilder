import axios from 'axios'

const proyectosApi = axios.create({
    baseURL: 'http://localhost:8000/'
})
export const getAllProyectos = () => proyectosApi.get('proyectos/')

export const getProyectoById = (id) => proyectosApi.get(`proyecto/${id}`)

export const crearProyecto = (proyecto) => proyectosApi.post('crear_proyecto/', proyecto)

export const eliminarProyecto = (id) => proyectosApi.delete(`/${id}`)

export const actualizarProyecto = (id, proyecto) => proyectosApi.put(`actualizar_proyecto/${id}`, proyecto)

export const crearEstado = (estado) => proyectosApi.post('crear_estado/',estado)

export const actualizarEstado = (estado) => proyectosApi.put(`actualizar_estado/`, estado)

export const getListaEstados = () => proyectosApi.get('lista_Estado/')

export const getEstadoProyecto = (id) => proyectosApi.get(`estado/${id}`)

export const crearComentario = (comentario) => proyectosApi.post('crear_comentario/', comentario)

export const getComentariosProyecto = (id) => proyectosApi.get(`/comentarios/proyecto/${id}`,id)

export const crearLider = (lider) => proyectosApi.post('crear_lider/',lider)

export const getLideresProyecto = (id) => proyectosApi.get(`lider/${id}`)

export const getLiderByUseryProyecto = (id_usuario, id_proyecto) => proyectosApi.get(`lider_usuario/${id_usuario}/${id_proyecto}`)

export const crearGrupo = (grupo) => proyectosApi.post('crear_grupo/',grupo)

export const asignarMiembro = (miembro) => proyectosApi.post('crear_miembro/',miembro)

export const getGruposLider = (id) => proyectosApi.get(`/grupos_lider/${id}`,id)

export const getMiembrosGrupo = (id_grupo) => proyectosApi.get(`/miembrosGrupo/${id_grupo}`,id_grupo)

export const eliminarMiembro = (id_usuario, id_grupo) => proyectosApi.delete(`eliminar_miembro/${id_usuario}/${id_grupo}`)

export const eliminarLider = (id_usuario, id_proyecto) => proyectosApi.delete(`eliminar_lider/${id_usuario}/${id_proyecto}`)

export const getClienteProject = (id_proyecto) => proyectosApi.get(`/asigCli_proyecto/${id_proyecto}`,id_proyecto)

export const asignarCliente = (cliente) => proyectosApi.post('crear_asignacion_cli/',cliente)












