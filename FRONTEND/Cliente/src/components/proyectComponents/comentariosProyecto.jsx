import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getComentariosProyecto, crearComentario, getEstadoProyecto } from '../../api/proyectos.api';

const ComentariosProyecto = ({ register, getValues, setValue }) => {
  const params = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (params.id) {
      cargarComentarios(params.id);
    }
  }, [params.id]);

  const cargarComentarios = async (proyectoId) => {
    try {
      const res = await getComentariosProyecto(proyectoId);
      const comentariosData = res.data.map(comentario => ({
        id_comentario: comentario[0],
        descripcion: comentario[1],
        fecha: comentario[2],
        estado_id_estado: comentario[3]
      }));
      setComentarios(comentariosData);
    } catch (error) {
      toast.error('Error al cargar los comentarios');
    }
  };

  const agregarComentario = async (comentario) => {
    try {
      if (!params.id) {
        toast.error('Debe guardar el proyecto antes de agregar comentarios');
        return;
      }

      const estadoActualRes = await getEstadoProyecto(params.id);
      const estadoActualId = estadoActualRes.data[0];

      await crearComentario({
        ID_Comentario: 0,
        Descripcion: comentario,
        Fecha: new Date().toISOString(),
        estado_id_estado: estadoActualId
      });

      setComentarios(prev => [...prev, { descripcion: comentario, fecha: new Date().toISOString(), estado_id_estado: estadoActualId }]);
      setValue('Comentario', '');
      toast.success('Comentario agregado');
    } catch (error) {
      toast.error('Error al agregar comentario');
    }
  };

  const comentariosFiltrados = comentarios
    .filter(comentario => comentario.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className='marcoformulario'>
      <h2>Comentarios</h2>
      <textarea
        rows="3"
        placeholder="Agregar comentario"
        {...register("Comentario")}
        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
      ></textarea>
      <button 
        type="button"
        onClick={() => agregarComentario(getValues('Comentario'))} 
        className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
      >
        Agregar Comentario
      </button>
      <div>
        <input
          type="text"
          placeholder="Buscar comentarios"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        />
        <ul>
          {comentariosFiltrados.map((comentario, index) => (
            <li key={index}>
              {comentario.descripcion} - {new Date(comentario.fecha).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComentariosProyecto;
