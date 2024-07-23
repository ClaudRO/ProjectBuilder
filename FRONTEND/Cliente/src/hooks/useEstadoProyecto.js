import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getEstadoProyecto } from '../api/proyectos.api';

export const useEstadoProyecto = (projectId) => {
  const [estadoProyecto, setEstadoProyecto] = useState(null);

  const cargarEstado = async () => {
    if (!projectId) return;

    try {
      const estadoRes = await getEstadoProyecto(projectId);
      const estadoActualId = estadoRes.data[2];
      setEstadoProyecto(estadoActualId);

    } catch (error) {
      toast.error('Error al cargar el estado del proyecto');
    }
  };

  useEffect(() => {
    cargarEstado();
  }, [projectId]);

  return { estadoProyecto, cargarEstado};
};
