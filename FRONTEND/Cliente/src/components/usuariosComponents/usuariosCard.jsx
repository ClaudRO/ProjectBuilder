import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from "react";
import {getCargos} from '../../api/usuarios.api'



export function UsuariosCard({usuario}) {
    const navigate = useNavigate()
    const [cargos, setCargos] = useState([]);

    useEffect(() => {
        async function loadCargos(){
            const res = await getCargos();
            const cargos = res.data.map(cargo => {
                return {
                    id_cargo:cargo[0],
                    nombre:cargo[1],
                    descripcion:cargo[2] // Srecibimos los datos como una matriz de arrays por lo que lo traducimos a simplemente un array ordenado con sus campos
                };
            });
            setCargos(cargos)
        }
        loadCargos();
    }, []);
    const getNombreCargo = (idCargo) => {
        const cargo = cargos.find(cargo => cargo.id_cargo === idCargo);
        return cargo ? cargo.nombre : 'Cargo no encontrado';
    };
    /*Me Parece que  se puede optimizar el flujo de datos en cuanto a la recuperacion y muestra de cargos */
    return (
        <div
            className="proyecto_card"
            onClick={()=>{
                navigate(`/usuarios/${usuario.id_usuario}`);
            }}
        >   
            <h1 className='font-bold uppercase'>Id: {usuario.id_usuario}</h1>
            <p className=''>Nombre: {usuario.nombres}</p>
            <p className=''>Apellidos: {usuario.apellidos}</p>
            <p className=''>Cargo: {getNombreCargo(usuario.cargo)}</p>
            <p className=''>Especialidad: {usuario.especialidad}</p>

        </div>
  );
}

