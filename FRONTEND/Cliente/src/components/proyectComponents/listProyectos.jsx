import { useEffect, useState } from "react";
import {getAllProyectos} from '../../api/proyectos.api'
import {ProyectoCard} from './ProyectoCard'
import { Link } from 'react-router-dom'; // Importa Link desde React Router



export function ProyectosList() {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        async function loadProyectos(){
            const res = await getAllProyectos();
            const proyectos = res.data.map(proyecto => {
                return {
                    id_proyecto:proyecto[0],
                    nombre:proyecto[1],
                    descripcion:proyecto[2],
                    fecha_inicio:proyecto[3],
                    fecha_termino:proyecto[4] // Srecibimos los datos como una matriz de arrays por lo que lo traducimos a simplemente un array ordenado con sus campos
                    
                };
            });
            setProyectos(proyectos)
        }
        loadProyectos();
    }, []);

  return (
    <div>
        <div className="mt-3">
            <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
                <Link to="/crear-proyecto">Nuevo Proyecto</Link>
            </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {proyectos.map(proyecto => (
                <ProyectoCard key={proyecto.id_proyecto} proyecto={proyecto}/>
            ))}
        </div>
        
    </div>
    
    );  
}
