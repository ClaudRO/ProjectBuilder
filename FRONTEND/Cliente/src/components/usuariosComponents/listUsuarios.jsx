import { useEffect, useState } from "react";
import {getAllUsuarios} from '../../api/usuarios.api'
import {UsuariosCard} from './usuariosCard'
import { Link } from 'react-router-dom'; // Importa Link desde React Router


export function UsuariosList() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        async function loadUsuarios(){
            const res = await getAllUsuarios();
            const usuarios = res.data.map(usuario => {
                return {
                    id_usuario:usuario[0],
                    rut:usuario[1],
                    nombres:usuario[2],
                    apellidos:usuario[3],
                    hashed_contrasenia:usuario[4],
                    sexo:usuario[5],
                    fecha_nacimiento:usuario[6],
                    cargo:usuario[7],
                    especialidad:usuario[8],
                    correo:usuario[9],
                    telefono:usuario[10],
                    disabled:usuario[11] // Srecibimos los datos como una matriz de arrays por lo que lo traducimos a simplemente un array ordenado con sus campos
                    
                };
            });
            setUsuarios(usuarios)
            
        }
        loadUsuarios();
    }, []);

  return (
    <div>
        <div className="mt-3">
            <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
                <Link to="/crear-usuario">Crear Usuario</Link>
            </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {usuarios.map(usuario => (
                <UsuariosCard key={usuario.id_usuario} usuario={usuario}/>
            ))}
        </div>
        
    </div>
    );
  
}