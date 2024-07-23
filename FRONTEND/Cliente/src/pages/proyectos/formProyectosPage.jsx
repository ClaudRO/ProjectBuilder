import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProyectoForm from '../../components/proyectComponents/ProyectoForm';
import ComentariosProyecto from '../../components/proyectComponents/comentariosProyecto';
import {
  crearProyecto,
  crearEstado,
  actualizarProyecto,
  actualizarEstado,
  getEstadoProyecto,
  asignarCliente
} from '../../api/proyectos.api';


import '../css/formProyecto.css';
import { useCargarDatosProyecto } from '../../hooks/useCargarDatosProyecto';

export function formProyectoPage() {
  const currentDate = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, formState: { errors }, setValue, reset, getValues } = useForm({
    defaultValues: {
      Nombre: '',
      Descripcion: '',
      Fecha_Inicio: currentDate,
      Fecha_Termino: currentDate,
      Estado: '',
      Comentario: '',
      Cliente: '',
      Area:'',
      

     
    },
  });
  const [selectedUserIds, setSelectedUserIds] = useState(null);
  const [selectedLiderId, setSelectedLiderId] = useState(null);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [Id, setId] = useState(([]));
  const [showListAux, setShowListAux] = useState(true);


  
  const navigate = useNavigate();
  const params = useParams();

  const {
    showUserList,
    usuarios,
    lideres,
    cargarDatosProyecto,
    estadoProyectoAux,
    estadoProyecto
    
  } = useCargarDatosProyecto(params.id, setValue);


  const crearNuevoProyectoYEstado = async (dataProyecto, dataEstado, dataLider) => {
    const proyecto = await crearProyecto(dataProyecto);

    if (proyecto && proyecto.data.id) {
      dataEstado.proyecto_id_proyecto = proyecto.data.id;
      await crearEstado(dataEstado);
      console.log("estado creado", proyecto.data)
      dataLider.ID_Proyecto = proyecto.data.id;

      if (dataLider.ID_Usuario) {
        await crearLider(dataLider);
      }

      toast.success('Proyecto, estado y líderes creados');
      return proyecto.data.id;
    } else {
      toast.error('Error al crear el proyecto');
      throw new Error('Error al crear el proyecto');
    }
  };

  const actualizarProyectoYEstado = async (proyectoId, dataProyecto, dataEstado, dataLider) => {
    console.log("estado auxiliar antes de actualizar", estadoProyectoAux)

    const estadoActualRes = await getEstadoProyecto(proyectoId);
    const estadoActualId = estadoActualRes.data[0];
    const dataEstadoAnterior = {/*los campos relevantes son id estado y actual, los demas nose necesitan actualizar */
      id_estado: estadoActualId,
      proyecto_id_proyecto: 0,
      estados_id_estados: 0,
      Fecha: "2024-05-23",
      actual: false,
    };
    if (dataLider.ID_Usuarios) {
      await crearLider(dataLider);
    }
    await actualizarEstado(dataEstadoAnterior);
    await actualizarProyecto(proyectoId, dataProyecto);
    dataEstado.proyecto_id_proyecto = proyectoId;
    await crearEstado(dataEstado);
    await cargarDatosProyecto(params.id);
    setId(dataEstado.estados_id_estados);
    console.log("dataestadoantes del if",dataEstado)
    if (dataEstado.estados_id_estados===3){
      console.log("if cumplido edl showlist",dataEstado.estados_id_estados);
      setShowListAux(true);
    }else{
      setShowListAux(false);
    }
    console.log("estado proyeco", estadoProyecto)

    toast.success('Cambios guardados, Proyecto actualizado correctamente');
  };

  const gestionarProyectoYEstado = async (data) => {
    const dataProyecto = {
      Nombre: data.Nombre,
      Descripcion: data.Descripcion,
      Fecha_Inicio: data.Fecha_Inicio,
      Fecha_Termino: data.Fecha_Termino,
    };
    const estadoId = parseInt(data.Estado, 10);
    const currentDate = new Date().toISOString().split('T')[0];
    const dataEstado = {
      id_estado: 0,
      proyecto_id_proyecto: '',
      estados_id_estados: estadoId,
      Fecha: currentDate,
      actual: true,
    };
    const dataAsignacionCliente = {
      ID_Onproyect:0,
      Area: data.Area,
      id_proyecto: params.id ? params.id : '',
      id_cliente: data.Cliente,

    };
    
    try {
      const dataLider = {
        ID_Lider: 0,
        ID_Proyecto: params.id ? params.id : '',
        ID_Area: 1,
        ID_Usuario: selectedUserIds
      };
      let proyectoId;
      if (params.id) {
        await actualizarProyectoYEstado(params.id, dataProyecto, dataEstado, dataLider);
        proyectoId = params.id;
        navigate(`/proyectos/${proyectoId}`);
      } else {
        proyectoId = await crearNuevoProyectoYEstado(dataProyecto, dataEstado, dataLider);
        console.log("id del proyecto recien creado",proyectoId)
        dataAsignacionCliente.id_proyecto=proyectoId;
        console.log(dataAsignacionCliente)
        await asignarCliente(dataAsignacionCliente)
        navigate('/proyectos/');
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud');
    }
  };

  return (
    <div className='bod2'>
      <div className='marcoformulario2'>
        <ProyectoForm
          register={register}
          errors={errors}
          setValue={setValue}
          reset={reset}
          handleSubmit={handleSubmit}
          onSubmit={gestionarProyectoYEstado}
          selectedLiderId={selectedLiderId}
          setSelectedLiderId={setSelectedLiderId}
          selectedClienteId={selectedClienteId}
          setSelectedClienteId={setSelectedClienteId}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
          usuarios={usuarios}
          lideres={lideres}
          showUserList={showUserList}
          Id={Id}
          showListAux={showListAux}  
        />
      </div>
      <ComentariosProyecto
        register={register}
        getValues={getValues}
        setValue={setValue}
      />
    </div>
  );
}
