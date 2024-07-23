import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getProyectoById,
  getLideresProyecto,
  getEstadoProyecto,
  getGruposLider,
  getLiderByUseryProyecto,
  getMiembrosGrupo,
  getClienteProject
 } from '../../src/api/proyectos.api';
import { getAllUsuarios } from '../../src/api/usuarios.api';
import { getAllClientes } from '../../src/api/clientes.api'
import { useEstadoProyecto } from '../../src/hooks/useEstadoProyecto';
import { useParams } from 'react-router-dom';

export const useCargarDatosProyecto = (paramsId, setValue) => {
  const params = useParams();
  const [showUserList, setShowUserList] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [allUsuarios, setAllUsuarios] = useState([]);
  const [usuariosCargados, setUsuariosCargados] = useState(false);
  const [lideresIds, setLideresIds] = useState([]);
  const [lideresIdsAux, setLideresIdsAux] = useState([]);
  const [liderGrupos, setGruposLider] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [miembrosIds, setMiembrosIds] = useState([]);
  const [infoGrupos, setInfo] = useState([]);
  const [AllClientes, setAllClientes] = useState([]);
  const [Cliente, setCliente] = useState([]);

  const { estadoProyecto, cargarEstado } = useEstadoProyecto(params.id);

  const [estadoProyectoAux, setProyectoAux] = useState([]);

  

  useEffect(() => {
    const fetchData = async () => {
      await loadUsuarios();
      await loadClientes();
      setUsuariosCargados(true);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (usuariosCargados && paramsId) {
        await cargarDatosProyecto(paramsId);
      }
    };
    fetchProjectData();
  }, [usuariosCargados, paramsId]);
  
  const loadUsuarios = async () => {
    const res = await getAllUsuarios();
    const usuarios = res.data.map(usuario => ({
      id_usuario: usuario[0],
      rut: usuario[1],
      nombres: usuario[2],
      apellidos: usuario[3],
      hashed_contrasenia: usuario[4],
      sexo: usuario[5],
      fecha_nacimiento: usuario[6],
      cargo: usuario[7],
      especialidad: usuario[8],
      correo: usuario[9],
      telefono: usuario[10],
      disabled: usuario[11],
    }));
    setUsuarios(usuarios);
    setAllUsuarios(usuarios);
  };
  const loadClientes = async () => {
    const res = await getAllClientes();
    const clientes = res.data.map(cliente => ({
      id_cliente: cliente[0],
      nombre: cliente[1]

    }));
    setAllClientes(clientes);

  };

  const cargarDatosProyecto = async (id) => {
  try {
    const proyectoRes = await getProyectoById(id);
    setValue('Nombre', proyectoRes.data[1]);
    setValue('Descripcion', proyectoRes.data[2]);
    setValue('Fecha_Inicio', proyectoRes.data[3]);
    setValue('Fecha_Termino', proyectoRes.data[4]);
    
    const estadoRes = await getEstadoProyecto(id);
    const estadoActualId = estadoRes.data[2];
    setProyectoAux(estadoActualId);
    setValue('Estado', estadoActualId);

    if (estadoActualId === 3) {
      setShowUserList(true);
    }
    const ClienteRes = await getClienteProject(id);
    console.log('ClienteRes:', ClienteRes.data);  // Añadir esta línea para depuración
    const Cliente = ClienteRes.data.map(cliente => cliente);
    console.log('ClienteMap:', Cliente[3]); 
    setCliente(Cliente);

    const lideresRes = await getLideresProyecto(id);
    const lideresIds = lideresRes.data.map(lider => lider[2]);
    setLideresIds(lideresIds);

    let auxLiderIds = [];
    let auxGruposLider = [];
    let gruposAux = [];
    let miembros = [];
    let gruposConMiembros = [];

    for (let i = 0; i < lideresIds.length; i++) {
      const gruposLiderRes = await getLiderByUseryProyecto(lideresIds[i], params.id);
      const grupos = await getGruposLider(gruposLiderRes.data[0][0]);
      
      let miembrosGp = await getMiembrosGrupo(grupos.data[0]);
      if (miembrosGp == null || miembrosGp.data == null) {
        miembrosGp = { data: [] };
      }

      const grupoConMiembros = {
        liderUser: gruposLiderRes.data[0][2],
        liderId: gruposLiderRes.data[0][0],
        grupoId: grupos.data[0],
        miembros: miembrosGp
      };

      gruposConMiembros.push(grupoConMiembros);
      miembros.push(miembrosGp);
      gruposAux.push(grupos.data);
      auxLiderIds.push(gruposLiderRes.data[0][0]);
      auxGruposLider.push(gruposLiderRes.data[0][0], gruposLiderRes.data[0][2]);
    }

    setInfo(gruposConMiembros);
    setGrupos(gruposAux);
    setLideresIdsAux(auxLiderIds);
    setGruposLider(auxGruposLider);
    setMiembrosIds(miembros);
    for (let i = 0; i < miembros.length; i++){
      let datos = miembros[i].data;

      // Si quieres recorrer los datos dentro de cada objeto data:
      for (let j = 0; j < datos.length; j++) {
          miembrosIds.push(datos[j][0])
      }
    }

    // Filtrar usuarios disponibles que no sean líderes ni miembros
    if (allUsuarios.length > 0) {
      const usuariosDisponibles = allUsuarios.filter(usuario => !lideresIds.includes(usuario.id_usuario));
      const usuariosAux =  usuariosDisponibles.filter(usuario => !miembrosIds.includes(usuario.id_usuario));
      setUsuarios(usuariosAux);
    }
    
  } catch (error) {
    toast.error('Error al cargar los datos del proyecto');
    console.error('Error en carga de datos del proyecto:', error);
  }
};

  
  useEffect(() => {
    
  }, [estadoProyectoAux]);

  return {
    showUserList,
    setShowUserList,
    usuarios,
    lideresIds,
    cargarDatosProyecto,
    estadoProyecto,
    estadoProyectoAux,
    cargarEstado,
    allUsuarios,
    liderGrupos,
    lideresIdsAux,
    grupos,
    miembrosIds,
    infoGrupos,
    AllClientes,
    Cliente
    
  };
};

