import { useEffect, useState } from "react";
import {getCargos} from '../../api/usuarios.api'

export function CargoList() {
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
    return (
            <ul>
                {cargos.map(cargo => (
                    <li key={cargo.id_cargo}>
                        <div>ID: {cargo.id_cargo}</div>
                        <div>Nombre: {cargo.nombre}</div>
                        <div>Descripción: {cargo.descripcion}</div>
                    </li>
                ))}
            </ul>
    );
  
}