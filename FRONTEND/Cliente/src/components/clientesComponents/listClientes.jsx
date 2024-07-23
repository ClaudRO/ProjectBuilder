import { useEffect, useState } from "react";
import {getAllClientes} from '../../api/clientes.api'
import {ClientesCard} from './clientesCard'
import { Link } from 'react-router-dom'; // Importa Link desde React Router


export function ClientesList() {
    const [clientes, setclientes] = useState([]);

    useEffect(() => {
        async function loadclientes(){
            const res = await getAllClientes();
            const clientes = res.data.map(cliente => {
                return {
                    id_cliente:cliente[0],
                    nombre:cliente[1],
                    correo:cliente[2],
                    direccion:cliente[4],
                    descripcion:cliente[5],
                    numero:cliente[6],
                    razon_social:cliente[7],
                    // Srecibimos los datos como una matriz de arrays por lo que lo traducimos a simplemente un array ordenado con sus campos
                    
                };
            });
            setclientes(clientes)
            
        }
        loadclientes();
    }, []);

  return (
    <div>
        <div className="mt-3">
            <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
                <Link to="/crear-cliente">Crear cliente</Link>
            </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {clientes.map(cliente => (
                <ClientesCard key={cliente.id_cliente} cliente={cliente}/>
            ))}
        </div>
        
    </div>
    );
  
}