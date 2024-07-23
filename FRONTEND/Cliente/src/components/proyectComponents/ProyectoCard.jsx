import {useNavigate} from 'react-router-dom'

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

export function ProyectoCard({proyecto}) {
    const navigate = useNavigate();
    const truncatedDescription = truncateText(proyecto.descripcion, 90); // Trunca la descripción a 100 caracteres

    return (
        <div
            className="proyecto_card"
            onClick={() => {
                navigate(`/proyectos/${proyecto.id_proyecto}`);
            }}
        >
            <h1 className='font-bold uppercase'>{proyecto.nombre}</h1>
            <p>Descripcion: {truncatedDescription}</p>
            <p>Fechas Iniciales</p>
            <p>Fecha de inicio: {proyecto.fecha_inicio}</p>
            <p>Fecha de termino: {proyecto.fecha_termino}</p>
        </div>
    );
}


