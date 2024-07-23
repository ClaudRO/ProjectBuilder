import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from "react";



export function ClientesCard({cliente}) {
    const navigate = useNavigate()

    /*Me Parece que  se puede optimizar el flujo de datos en cuanto a la recuperacion y muestra de cargos */
    return (
        <div
            className="proyecto_card"
            onClick={()=>{
                navigate(`/clientes/${cliente.id_cliente}`);
            }}
        >   
            <h1 className='font-bold uppercase'>Id: {cliente.id_cliente}</h1>
            <p className=''>Nombre: {cliente.nombre}</p>
            <p className=''>Correo: {cliente.correo}</p>

        </div>
  );
}

