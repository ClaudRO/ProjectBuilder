import { useEffect, useState } from "react";
import { getPrivilegios } from '../../api/usuarios.api';

export function PrivilegiosList() {
    const [privilegios, setPrivilegios] = useState([]);

    useEffect(() => {
        async function loadPrivilegios() {
            const res = await getPrivilegios();
            setPrivilegios(res.data);
        }
        loadPrivilegios();
    }, []);

    return (
        <div>
            <h2>Lista de Privilegios</h2>
            <ul>
                {privilegios.map(privilegio => (
                    <li key={privilegio.id_privilegio}>{privilegio.nombre}</li>
                ))}
            </ul>
        </div>
    );
}
