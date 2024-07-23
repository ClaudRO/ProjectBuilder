import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getListaEstados } from '../api/proyectos.api';

export const useEstados = () => {
  const [listaEstados, setListaEstados] = useState([]);

  useEffect(() => {
    async function cargarListaEstados() {
      try {
        const res = await getListaEstados();
        const estados = res.data.map(estado => ({
          id_estados: estado[0],
          nombre_estado: estado[1],
          descripcion_estado: estado[2],
        }));
        setListaEstados(estados);
      } catch (error) {
        toast.error('Error al cargar la lista de estados');
      }
    }
    cargarListaEstados();
  }, []);

  return listaEstados;
};
