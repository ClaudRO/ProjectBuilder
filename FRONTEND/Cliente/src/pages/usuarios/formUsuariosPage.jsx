import {useForm} from 'react-hook-form'
import {useEffect, useState } from 'react'
import {crearUsuario, actualizarUsuario, getUsuarioById, getCargos} from '../../api/usuarios.api'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import '../css/formUsuarios.css'

export function formUsuariosPage(){
    const { register, handleSubmit, formState:{errors}, setValue } = useForm();

    const navigate = useNavigate()
    const params = useParams()

    const [cargos, setCargos] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
     };

    useEffect(() => {
        async function cargarCargos() {
            const res = await getCargos();
            const cargos = res.data.map(cargo => {
                return {
                    id_cargo:cargo[0],
                    nombre:cargo[1],
                    descripcion:cargo[2] // Srecibimos los datos como una matriz de arrays por lo que lo traducimos a simplemente un array ordenado con sus campos
                };
            });
            setCargos(cargos)
            console.log("nueva respuesta de cargolist",cargos);
        }
        cargarCargos();
    }, []);

    const onSubmit = handleSubmit(async data => {
        if (params.id){  
            console.log("flag de la data que se sube",data);  
            data.disabled = true;
            await actualizarUsuario(params.id,data)
        }else{
            console.log(data);
            data.disabled = true;
            await crearUsuario(data);
            toast.success('Usuario creado')
        }    
        navigate('/proyectos')
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const vaciarCampos = () => {
        setValue('ID_Usuario', 0); // Vaciar campo de título
        setValue('Rut', '');
        setValue('Nombres', '');
        setValue('Apellidos', '');
        setValue('hashed_Contrasenia', '');
        setValue('Sexo', '');
        setValue('Fecha_Nacimiento', '');
        setValue('Cargo', '');
        setValue('Especialidad', '');
        setValue('Correo', ''); 
        setValue('Telefono', '');// Vaciar campo de descripción
    };
    useEffect(() => {
        if (!params.id) {
            vaciarCampos();
        } else {
            // Cargar usuario si params.id está definido
            async function cargarUsuario() {
                console.log("entro en cargar usuario: ");
                const res = await getUsuarioById(params.id);
                console.log("res.data: ", res.data);
                console.log("res: ", res);

               
                setValue('ID_Usuario', res.data[0]); // el tipo de dato recibido es un array por lo que asi se deben definir los valores
                setValue('Rut',res.data[1]);
                setValue('Nombres', res.data[2]);
                setValue('Apellidos', res.data[3]);
                setValue('hashed_Contrasenia',res.data[4]);
                setValue('Correo', res.data[5]);
                setValue('Especialidad', res.data[6]);
                setValue('Cargo',res.data[7]);
                setValue('Fecha_Nacimiento', res.data[8]);
                setValue('Telefono', res.data[9]);
                setValue('Sexo', res.data[10]);
                
                
            }
            cargarUsuario(); 
        }
    }, [params.id]);
    /*aca params.id es necesario para detectar cambios en el id de la url si este cambio o si no se entrega*/

    return (
            <div className='bod'>      
            {       
            <div className='marcoformulario'>  
                <form onSubmit={onSubmit}>
                
                
                    <div className='centrar'><h1>Registro</h1></div>
                    <div className='celda'>
                        <div className=''>
                                <h1>Rut:</h1>
                                <input
                                    type="text"
                                    placeholder="Rut"
                                    {...register("Rut", { required: true })}
                                    className='mi-clase3'
                                />
                                {errors.Rut && <span>El campo Rut es requerido</span>}

                                <h1>Nombres:</h1>
                                <input
                                    type="text"
                                    placeholder="Nombres" 
                                    {...register("Nombres", { required: true })}
                                    className='mi-clase3'
                                />
                                {errors.Nombres && <span>El campo Nombres es requerido</span>}

                                <h1>Apellidos:</h1>
                                <input
                                    type="text"
                                    placeholder="Apellidos" 
                                    {...register("Apellidos", { required: true })}
                                    className='mi-clase3'
                                />
                                {errors.Apellidos && <span>El campo Apellidos es requerido</span>}

                                <h1>Correo:</h1>
                                <input
                                    type="email"
                                    placeholder="Correo" 
                                    {...register("Correo", { required: true })}
                                    className='mi-clase3'
                                />
                                {errors.Correo && <span>El campo Correo es requerido</span>}

                                <div className="password-input-container">
                                    <h1>Contraseña:</h1>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Contraseña"
                                        {...register("hashed_Contrasenia", { required: true})}
                                        className='mi-clase3'
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>

                                

                        </div>
                    </div>
                    <div className='celda'>
                        
                        <div className=''>
                            <h1>Sexo:</h1>
                            <select
                                {...register("Sexo", { required: true })}
                                className='mi-clase3'
                            >
                                <option value="">Seleccione el sexo</option>
                                <option value="true">Masculino</option>
                                <option value="false">Femenino</option>
                            </select>
                            {errors.Sexo && <span>El campo Sexo es requerido</span>}

                            <h1>Fecha de nacimiento</h1>
                            <input
                                type="date"
                                placeholder="Fecha de Nacimiento" 
                                {...register("Fecha_Nacimiento", { required: true })}
                                className='mi-clase3'
                            />
                            {errors.Fecha_Nacimiento && <span>El campo Fecha de Nacimiento es requerido</span>}

                            <h1>Cargo:</h1>
                            <select 
                                {...register("Cargo", { required: true })}
                                className='mi-clase4'
                            >
                                <option value="">Seleccione un cargo</option>
                                {cargos.map(cargo => (
                                    <option key={cargo.id_cargo} value={cargo.id_cargo}>{cargo.nombre}</option>
                                ))}
                            </select>
                            {errors.Cargo && <span>El campo Cargo es requerido</span>}

                            <h1>Especialidad:</h1>
                            <input
                                type="text"
                                placeholder="Especialidad" 
                                {...register("Especialidad", { required: true })}
                                className='mi-clase3'
                            />
                            {errors.Especialidad && <span>El campo Especialidad es requerido</span>}
                            
                            <h1>Telefono:</h1>
                            <input
                                type="text"
                                placeholder="Teléfono" 
                                {...register("Telefono", { required: true })}
                                className='mi-clase3'
                            />
                            {errors.Telefono && <span>El campo Teléfono es requerido</span>}

                        </div>
                    </div>
                    <button
                        className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
                    >Guardar</button>
                
                </form>        
            </div>                      
            }                
        </div>
        );
}