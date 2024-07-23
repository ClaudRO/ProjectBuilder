import {useForm} from 'react-hook-form'
import {useEffect, useState } from 'react'
import {crearCliente, actualizarCliente, getClienteById} from '../../api/clientes.api'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import '../css/formUsuarios.css'

export function FormClientesPage(){
    const { register, handleSubmit, formState:{errors}, setValue } = useForm();

    const navigate = useNavigate()
    const params = useParams()

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const onSubmit = handleSubmit(async data => {
        if (params.id){  
            console.log("flag de la data que se sube",data);  
            data.disabled = true;
            await actualizarCliente(params.id,data)
        }else{
            console.log(data);
            data.disabled = true;
            await crearCliente(data);
            toast.success('Usuario creado')
        }    
        navigate('/clientes')
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const vaciarCampos = () => {
        setValue('ID_Cliente', 0); // Vaciar campo de título
        setValue('Cli_Nombre', '');
        setValue('Cli_Correo', '');
        setValue('Cli_Direccion', '');
        setValue('Cli_Descripcion', '');
        setValue('Cli_Numero', '');
        setValue('Razon_Social', ''); 
    };
    useEffect(() => {
        if (!params.id) {
            vaciarCampos();
        } else {
            // Cargar usuario si params.id está definido
            async function cargarCliente() {
                console.log("entro en cargar cliente: ");
                const res = await getClienteById(params.id);
                console.log("res.data: ", res.data);
                console.log("res: ", res);
                setValue('ID_Cliente', res.data[0]); // el tipo de dato recibido es un array por lo que asi se deben definir los valores
                setValue('Cli_Nombre', res.data[1]);
                setValue('Cli_Correo', res.data[2]);
                setValue('Cli_Direccion', res.data[3]);
                setValue('Cli_Descripcion',res.data[4]);
                setValue('Cli_Numero', res.data[5]);
                setValue('Razon_Social', res.data[6]);                                
            }
            cargarCliente(); 
        }
    }, [params.id]);
    /*aca params.id es necesario para detectar cambios en el id de la url si este cambio o si no se entrega*/

    return (
            <div className='bod'>      
            {       
            <div className='marcoformulario'>  
                <form onSubmit={onSubmit}>
                
                
                    <div className='centrar'><h1>Registro de Clientes</h1></div>
                    <div className='celda'>
                        <div className=''>
                                <h1>nombres:</h1>
                                <input
                                    type="text"
                                    placeholder="nombre" 
                                    {...register("Cli_Nombre", { required: true })}
                                    className='mi-clase3'
                                />
                                {errors.Cli_nombre && <span>El campo Cli_nombres es requerido</span>}

                                <h1>Correo:</h1>
                                <input
                                    type="email"
                                    placeholder="Correo" 
                                    {...register("Cli_Correo", { required: true })}
                                    className='mi-clase3'
                                />
                                {errors.Cli_Correo && <span>El campo Correo es requerido</span>}

                                <h1>Direccion:</h1>
                                <input

                                    placeholder="Direccion"
                                    {...register("Cli_Direccion", { required: true})}
                                    className='mi-clase3'
                                />
                                {errors.Cli_Direccion && <span>El campo Direccion es requerido</span>}


                        </div>
                    </div>
                    <div className='celda'>
                        
                        <div className=''>

                            <h1>Descripcion:</h1>
                            <input
                                type="text"
                                placeholder="Descripcion" 
                                {...register("Cli_Descripcion", { required: true })}
                                className='mi-clase3'
                            />
                            {errors.Cli_Descripcion && <span>El campo Especialidad es requerido</span>}
                            
                            <h1>Numero:</h1>
                            <input
                                type="number"
                                placeholder="numero" 
                                {...register("Cli_Numero", { required: true })}
                                className='mi-clase3'
                            />
                            {errors.Cli_Numero && <span>El campo Teléfono es requerido</span>}
                            <h1>Razon Social:</h1>
                            <input
                                type="text"
                                placeholder="Razon_Social:" 
                                {...register("Razon_Social", { required: true })}
                                className='mi-clase3'
                            />
                            {errors.Cli_Razon_Social && <span>El campo Especialidad es requerido</span>}

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