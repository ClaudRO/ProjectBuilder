import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEstados } from '../../hooks/useEstados';
import { useCargarDatosProyecto } from '../../hooks/useCargarDatosProyecto';
import {
  crearLider,
  crearGrupo,
  getGruposLider,
  asignarMiembro,
  eliminarMiembro,
  eliminarLider
} from '../../api/proyectos.api';

const ProyectoForm = ({ register, errors, Id, setValue, handleSubmit, onSubmit, selectedUserIds, setSelectedUserIds, selectedLiderId, setSelectedLiderId, selectedClienteId, setSelectedClienteId, showUserList, showListAux }) => {
  const params = useParams();
  const listaEstados = useEstados();
  const [showLiderList, setShowLiderList] = useState(false);
  const [showLiderDelet, setShowDeletLider] = useState(false);
  const [showMembDelet, setShowDeletMemb] = useState(false);
  const [showMiembrosList, setShowMembList] = useState(false);


  const {
    usuarios,
    lideresIds,
    cargarDatosProyecto,
    estadoProyecto,
    estadoProyectoAux,
    allUsuarios,
    liderGrupos,
    lideresIdsAux,
    grupos,
    miembrosIds,
    infoGrupos,
    AllClientes,
    Cliente
  } = useCargarDatosProyecto(params.id, setValue);

  const handleCreateLider = async () => {
    try {
      if (Id !== 3) {
        if (estadoProyecto !== 3) { 
          toast.error('Debe confirmar el cambio de estado antes de poder asignar el equipo');
          return;
        }
      }
      const dataLider = {
        ID_Lider: 0,
        ID_Proyecto: params.id,
        ID_Area: 1,
        ID_Usuario: selectedUserIds
      };
      
      if (selectedUserIds) {
        const id_lider = await crearLider(dataLider);
        const dataGrupo = {
          ID_Grupo: 0,
          nombre: '',
          descripcion: '',
          lider_id_lider: id_lider.data.id
        }
        console.log(dataGrupo)
        await crearGrupo(dataGrupo);
        if (params.id) {
          await cargarDatosProyecto(params.id);
        }
        toast.success('Líderes creados con éxito');
      } else {
        toast.error('No se han seleccionado usuarios para ser líderes');
      }
    } catch (error) {
      toast.error('Error al crear los líderes');
    }
  };

  const handleDeleteLider = async (liderId) => {
    try {
      await eliminarLider(liderId, params.id)
  
      if (params.id) {
        setSelectedLiderId(null);
        await cargarDatosProyecto(params.id);
      }
  
      toast.success('Líder eliminado con éxito');
    } catch (error) {
      toast.error('Error al eliminar el líder');
    }
  };

  const handleCreateMiembro = async () => {
    let idAux = null;

    for (let i = 0; i < liderGrupos.length; i++) {
      if (liderGrupos[i] == selectedLiderId[0]) {
        idAux = liderGrupos[i - 1];
        break;
      }
    }
    
    const dataGrupo = await getGruposLider(idAux);
    try {
      const dataMiembro = {
        id_miembro: 0,
        id_rol: 0,
        id_usuario: selectedUserIds[0],
        id_grupo: dataGrupo.data[0]
      };
      await asignarMiembro(dataMiembro);
      console.log("informacion grupos", infoGrupos)
      console.log("miembros", miembrosIds)
      console.log("lider grupos", liderGrupos)
      console.log("lideres ids", lideresIds)
      console.log("data miembro", dataMiembro)
      console.log("lider ids", lideresIdsAux)
      console.log("grupos", grupos);
      if (params.id) {
        await cargarDatosProyecto(params.id);
      }
    } catch (error) {
      toast.error('Error al crear los líderes');
    }
  };
  const getMiembrosDeLider = (liderId) => {
    // Verifica que 'liderId' esté definido y que 'infoGrupos' sea un array
    if (!liderId || !Array.isArray(infoGrupos)) {
      return [];
    }
  
    // Usa 'find' para buscar el grupo con el 'liderId' proporcionado
    const grupo = infoGrupos.find(grupo => grupo.liderUser === parseInt(liderId));  
    // Si el grupo no tiene miembros, devuelve un array vacío
    if (!grupo || !grupo.miembros.data.length) {
      return [];
    }
  
    return grupo.miembros.data;
  };
  
  const handleDeleteMiembro = async (miembroId) => {
    let idAux = null;

    for (let i = 0; i < liderGrupos.length; i++) {
      if (liderGrupos[i] == selectedLiderId[0]) {
        idAux = liderGrupos[i - 1];
        break;
      }
    }
    
    const dataGrupo = await getGruposLider(idAux);
    try {
        // Aquí puedes obtener el id_grupo necesario para la eliminación
        const id_grupo = dataGrupo.data[0];
  
        // Llama a la función de eliminación de miembro
        
        await eliminarMiembro(miembroId[0],id_grupo);
  
        // Recarga los datos del proyecto si hay un id de proyecto
        if (params.id) {
          await cargarDatosProyecto(params.id);
        }
  
        toast.success('Miembro eliminado con éxito');
    } catch (error) {
      toast.error('Error al eliminar el miembro');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='centrar'><h1> {params.id ? 'Administrar Proyecto' : 'Registro de Proyectos'}</h1></div>
      <div className='form-group'>
        <div className='celda'>
          <h1>Nombre del Proyecto:</h1>
          <input
            type="text"
            placeholder="Nombre del Proyecto"
            {...register("Nombre", { required: true })}
            className='proyecto_card'
          />
          {errors.Nombre && <span>El campo del nombre es requerido</span>}
        </div>
        <div className='celda'>
          <h1>Estado:</h1>
          <select
            {...register("Estado", { required: true })}
            className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
            onChange={(e) => {
              const value = e.target.value;
              setValue('Estado', value);
            }}
          >
            <option value="">Seleccione un estado</option>
            {listaEstados.map(estado => (
              <option key={estado.id_estados} value={estado.id_estados}>{estado.nombre_estado}</option>
            ))}
          </select>
          {errors.Estado && <span>El campo Estado es requerido</span>}
        </div>
        <div className='celda'>
          <div className='celda'>
            <h1>Cliente:</h1>
            <select
              {...register("Cliente", { required: false })}
              className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
              value={selectedClienteId || Cliente[3]}
              onChange={(e) => {
                const value = e.target.value;
                setValue('Cliente', value);
                setSelectedClienteId(value);
              }}
            >
              <option value="">Seleccione un Cliente</option>
              {AllClientes.map(cliente => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nombre}</option>
              ))}
            </select>
            {errors.Cliente && <span>El campo Cliente es requerido</span>}
            
          </div>
          {(selectedClienteId || Cliente[3])  && (
              <div className='celda'>
                <h1>Área:</h1>
                <input
                  type="text"
                  placeholder="Área de la Empresa del Cliente"
                  {...register("Area", { required: false })}
                  value={Cliente[1]}
                  className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                />
                {errors.Area && <span>El campo Área es requerido</span>}
              </div>
            )}
          </div>  
        <div className='celda'>
          <div className='celda'>
            <h1>Fecha de inicio:</h1>
            <input
              type="date"
              placeholder="Fecha de Inicio"
              {...register("Fecha_Inicio", { required: true })}
              className='mi-clase3'
            />
            {errors.Fecha_Inicio && <span>El campo fecha de inicio es requerido</span>}
          </div>
          <div className='celda'>
            <h1>Fecha de termino:</h1>
            <input
              type="date"
              placeholder="Fecha de Termino"
              {...register("Fecha_Termino", { required: true })}
              className='mi-clase3'
            />
            {errors.Fecha_Termino && <span>El campo fecha de termino es requerido</span>}
          </div>
        </div>  
      </div>
      <div className='celda2'>
        <h1>Descripcion:</h1>
        <textarea
          rows="3"
          placeholder="Descripción"
          {...register("Descripcion", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        ></textarea>
        {errors.Descripcion && <span>El campo de descripcion es requerido</span>}
      </div>
      <button className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'> {params.id ? 'Actualizar proyecto': 'Guardar proyecto' }</button>

     
        <div className='marcoformulario2'>
          <div className="flex items-center justify-between">
            <h1>Líderes Actuales del Proyecto</h1>
            <div className="justify-end">
              <button
                type="button"
                onClick={() => setShowLiderList(!showLiderList)}
                className='bg-indigo-500 text-white rounded-full px-2 py-1'>
                {showLiderList ? '<-' : '+'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeletLider(!showLiderDelet)}
                className='bg-indigo-500 text-white rounded-full px-2 py-1'>
                {showLiderDelet ? '<-' : '-'}
              </button>
            </div>
          </div>
          <div className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'>
            {lideresIds.length > 0 ? (
              lideresIds.map((liderId, index) => {
                const lider = allUsuarios.find(usuario => usuario.id_usuario === liderId);
                return (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="selectedLider"
                        value={liderId}
                        onChange={() => setSelectedLiderId([liderId])}
                        className="mr-2"
                      />
                      <span>
                        {lider ? `${lider.nombres} ${lider.apellidos}` : liderId}
                      </span>
                    </div>
                    {showLiderDelet && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLider(liderId)}
                        className=' text-white rounded-full px-2 py-1'
                      >
                        x
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <span>No se han asignado líderes aún</span>
            )}
          </div>
        </div>
   
      {showListAux && showUserList && showLiderList && (
        <div className='marcoformulario2'>
          <h1>Asignar Líderes al Proyecto</h1>
          <select
            multiple
            className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
            onChange={(e) => {
              const value = e.target.value;
              setSelectedUserIds(value);
            }}
          >
            {usuarios.map(usuario => (
              <option key={usuario.id_usuario} value={usuario.id_usuario}>
                {`${usuario.nombres} ${usuario.apellidos}`}
              </option>
            ))}
          </select>
          <button type="button"
            className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
            onClick={handleCreateLider}
            disabled={!params.id}>
            Asignar Líder
          </button>
          
        </div>
      
      )}
      {selectedLiderId && (
        <div className='marcoformulario2'>
          <div className="flex items-center justify-between">
              <h1>Miembros del Grupo del Líder</h1>
              <div className="justify-end">
                <button
                  type="button"
                  onClick={() => setShowMembList(!showMiembrosList)}
                  className='bg-indigo-500 text-white rounded-full px-2 py-1'>
                  {showMiembrosList ? '<-' : '+'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeletMemb(!showMembDelet)}
                  className='bg-indigo-500 text-white rounded-full px-2 py-1'>
                  {showMembDelet ? '<-' : '-'}
                </button>
              </div>
          </div>
          <div className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'>
            {getMiembrosDeLider(selectedLiderId).length > 0 ? (
              getMiembrosDeLider(selectedLiderId).map(miembroId => {
                const miembro = allUsuarios.find(usuario => usuario.id_usuario === miembroId[0]);
                return (
                  <div key={miembroId} className="flex items-center justify-between mb-2">
                    <span>
                      {miembro ? `${miembro.nombres} ${miembro.apellidos}` : miembroId}
                    </span>
                    {showMembDelet && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMiembro(miembroId)}
                        className='text-white px-2 py-1'
                      >
                        x
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <span>No se han asignado miembros aún al grupo del líder seleccionado</span>
            )}
          </div>
        </div>
      )}

      {selectedLiderId  && showMiembrosList && (
        <div className='marcoformulario2'>
          <h1>Asignar Miembros al Grupo del Líder</h1>
          <select
            multiple
            className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
            onChange={(e) => {
              const value = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedUserIds(value);
            }}
          >
            {usuarios.map(usuario => (
              <option key={usuario.id_usuario} value={usuario.id_usuario}>
                {`${usuario.nombres} ${usuario.apellidos}`}
              </option>
            ))}
          </select>
          <button type="button"
            className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
            onClick={() => {
              handleCreateMiembro();
            }}
            disabled={!selectedLiderId}>
            Asignar Miembros
          </button>
        </div>
      )}
    </form>
  );
};

export default ProyectoForm;
