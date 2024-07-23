import {BrowserRouter, Routes,Route, Navigate} from 'react-router-dom'

import { proyectosPage as ProyectosPage } from './pages/proyectos/proyectosPage'
import { formProyectoPage as FormProyectoPage} from './pages/proyectos/formProyectosPage'

import {usuariosPage as Usuarios} from './pages/usuarios/usuariosPage'
import {formUsuariosPage as FormUsuariosPage} from './pages/usuarios/formUsuariosPage'

import {ClientesPage} from './pages/clientes/clientesPage'
import {FormClientesPage} from './pages/clientes/formClientes'

import {LoginForm} from './pages/usuarios/LoginUsuariosPage'
import LoginFormPage from './pages/usuarios/LoginFormPage'

import {HomePage} from './pages/HomePage'
import {Navigation} from './components/Navigation'
/*este import es importante para la estetica */
import {Toaster} from 'react-hot-toast'
/* nota
Tuve problemas al principio del todo, al probar la funcion proyectosPage ocurrio un problema tecnico
ya que no me dejaba utilizar el nombre de la funcion importada directamente en el element, como que no la reconocia
por lo tanto tuve que cambiarle de nombre y empezo a reconocerla, el tutorial por el que me guie no necesitó hacer esto
actualizacion:
  el problema de debe a que hay una convencion de que los componentes se llamen en mayusculas y los html en minusculas
*/
function App() {
    return (
      <BrowserRouter>
        <div className="container mx-auto">
        <Navigation/>
          <Routes>
            <Route path="/" element={<Navigate to="/login2"/> }/>

            <Route path="/Inicio" element={<HomePage/> }/>
            <Route path="/login2" element={<LoginFormPage/> }/>

            <Route path="/proyectos" element={<ProyectosPage/> }/>
            <Route path="/crear-proyecto" element={<FormProyectoPage/> }/>
            <Route path="/proyectos/:id" element={<FormProyectoPage/> }/>

            <Route path="/usuarios" element={<Usuarios/> }/>
            <Route path="/crear-usuario" element={<FormUsuariosPage/> }/>
            <Route path="/usuarios/:id" element={<FormUsuariosPage/> }/>

            <Route path="/clientes" element={<ClientesPage/> }/>
            <Route path="/crear-cliente" element={<FormClientesPage/> }/>
            <Route path="/clientes/:id" element={<FormClientesPage/> }/>


          </Routes>
          <Toaster/>
        </div>
      </BrowserRouter>
    );
  }


export default App
