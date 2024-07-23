import psycopg2
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from model.security_auth import Token, create_access_token, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user
from config.user_connection import UserConnection

from model.usuario import Usuarios 
from model.proyecto import Proyecto
from model.cliente import Cliente
from model.ClienteAsignado import en_proyecto
from model.cargo import Cargos 
from model.estado import Estado
from model.estados import Estados
from model.comentario import Comentario
from model.Lider_Proyecto import Lider
from model.Proyecto_Asignado import ProyectoAsignado
from model.Grupo_Asignado import Gp_asignado
from model.TeamMember import TeamMember


from typing import Annotated
from datetime import timedelta

from Schemas.SchemaUsuario import UsuarioCreateModel
from Schemas.SchemaProyecto import ProyectoCreateModel
from Schemas.SchemaCliente import ClienteCreateModel
from Schemas.SchemaClienteAsignado import ClienteAsignadoCreateModel
from Schemas.SchemaCargo import CargoCreateModel
from Schemas.SchemaEstado import EstadoCreateModel
from Schemas.SchemaEstados import EstadosCreateModel
from Schemas.SchemaComentario import ComentarioCreateModel
from Schemas.SchemaLider_Proyecto import LiderCreateModel
from Schemas.SchemaProyectoAsig import ProyectoAsignadoCreateModel
from Schemas.SchemaGrupo_Asignado import GrupoAsignadoCreateModel
from Schemas.SchemaTeamMember import TeamMemberCreateModel
# Token de autenticación
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Instancias
app = FastAPI()
conn = UserConnection()
usuarios = Usuarios(conn)  
proyecto = Proyecto(conn)
cliente = Cliente(conn)
cargos = Cargos(conn)
estados = Estado(conn)
lista_estados = Estados(conn)
comentario_db = Comentario(conn)
lider_db = Lider(conn)
asignaciones = ProyectoAsignado(conn)
Grupo = Gp_asignado(conn)
miembro = TeamMember(conn)
Asignacion_cli=en_proyecto(conn)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)  

# API USUARIO
@app.post("/crear_usuario/")
def crear_usuario(usuario: UsuarioCreateModel):
    try:
        usuarios.create_usuario(usuario.model_dump())
        return {"message": "Usuario creado exitosamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el usuario: {str(e)}")

@app.get("/usuario/{id}/")
def obtener_usuario(id: int):
    usuario = usuarios.read_filter(id)
    if usuario:
        return usuario
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

@app.get("/usuarios/")
def obtener_todos_los_usuarios():
    return usuarios.read_all()

@app.put("/actualizar_usuario/{id}")
def actualizar_usuario(id: int, usuario: UsuarioCreateModel):
    updated_data = usuario.model_dump()
    updated_data["ID_Usuario"] = id
    if usuarios.update_usuario(updated_data):
        return {"message": "Usuario actualizado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

@app.delete("/eliminar_usuario/{rut}/")
def eliminar_usuario(rut: str):
    if usuarios.delete_usuario(rut):
        return {"message": "Usuario eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

# API USUARIO AUTENTICACION
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.Correo}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me/", response_model=UsuarioCreateModel)
async def read_users_me(
    current_user: Annotated[UsuarioCreateModel, Depends(get_current_active_user)],
):
    print("Usuario actual:", current_user)  # Impresión de depuración
    return current_user

# API TABLA PROYECTO
@app.post("/crear_proyecto/")
def crear_proyecto(proyecto_data: ProyectoCreateModel):
    try:
        proyecto_id = proyecto.create_proyecto(proyecto_data)
        if proyecto_id is not None:
            return {"message": "Proyecto creado exitosamente", "id": proyecto_id}
        else:
            raise HTTPException(status_code=500, detail="Error al crear el proyecto")
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el proyecto: {str(e)}")

@app.get("/proyecto/{proyecto_id}")
def obtener_proyecto(proyecto_id: int):
    proyecto_data = proyecto.read_proyecto(proyecto_id)
    if proyecto_data:
        return proyecto_data
    else:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

@app.get("/proyectos/")
def obtener_todos_los_proyectos():
    return proyecto.read_all_proyectos()

@app.put("/actualizar_proyecto/{id}")
def actualizar_proyecto(id: int, proyecto_data: ProyectoCreateModel):
    updated_data = proyecto_data.model_dump()
    updated_data["ID_Proyecto"] = id
    if proyecto.update_proyecto(updated_data):
        return {"message": "Proyecto actualizado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

@app.delete("/eliminar_proyecto/{proyecto_id}")
def eliminar_proyecto(proyecto_id: int):
    if proyecto.delete_proyecto(proyecto_id):
        return {"message": "Proyecto eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
@app.delete("/eliminar_proyectos/")
def eliminar_proyecto():
    if proyecto.delete_all_proyectos():
        return {"message": "Proyectos eliminados correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")    
    

# API CLIENTE
@app.post("/crear_cliente/")
def crear_cliente(cliente_data: ClienteCreateModel):
    try:
        cliente.create_cliente(cliente_data)
        return {"message": "Cliente creado exitosamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el cliente: {str(e)}")
    


@app.get("/cliente/{cliente_id}")
def obtener_cliente(cliente_id: int):
    cliente_data = cliente.read_cliente(cliente_id)
    if cliente_data:
        return cliente_data
    else:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

@app.get("/clientes/")
def obtener_todos_los_clientes():
    return cliente.read_all_clientes()

@app.put("/actualizar_cliente/{cliente_id}")
def actualizar_cliente(cliente_id: int, cliente_data: ClienteCreateModel):
    try:
        cliente.update_cliente(cliente_id, cliente_data)
        return {"message": "Cliente actualizado correctamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

@app.delete("/eliminar_cliente/{cliente_id}")
def eliminar_cliente(cliente_id: int):
    if cliente.delete_cliente(cliente_id):
        return {"message": "Cliente eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

#Api Tabla de asginacion de los clientes "en proyecto"

@app.post("/crear_asignacion_cli/")
def create_Asignacion_Cli(asig_data: ClienteAsignadoCreateModel):
    try:
        Asignacion_cli.create_Asignacion_Cli(asig_data)
        return {"message": "Asignacion de Cliente a proyecto creado exitosamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la asignacion: {str(e)}")

@app.get("/asignacion_cli/{id_asignacion}")
def obtener_asignacion_cli(id_asignacion : int):
    data = Asignacion_cli.ver_un_Asignacion_Cli(id_asignacion)
    if data:
        return data
    else:
        raise HTTPException(status_code=404, detail="asignacion no encontrada")

@app.get("/asigCli_proyecto/{id_proyecto}")
def obt_cli_de_proyecto(id_proyecto : int):
    data = Asignacion_cli.ver_Asig_Cli_project(id_proyecto)
    if data:
        return data
    else:
        raise HTTPException(status_code=404, detail="asignacion buscada por proyecto no encontrada")

@app.get("/asignaciones_cli/")
def obtener_todas_las_asignaciones():
    return Asignacion_cli.Ver_Asignacion_Clis()


    
    




# API TABLA Estado
@app.post("/crear_estado/")
def crear_estado(estado_data: EstadoCreateModel):
    try:
        estados.create_estado(estado_data.model_dump())
        return {"message": "Estado creado exitosamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el estado: {str(e)}")

@app.get("/estado/{estado_id}")
def obtener_estado(estado_id: int):
    estado_data = estados.leer_estado_proyecto(estado_id)
    if estado_data:
        return estado_data
    else:
        raise HTTPException(status_code=404, detail="Estado no encontrado")

@app.get("/estados/")
def obtener_todos_los_estados():
    return estados.leer_estados()

@app.put("/actualizar_estado/")
def actualizar_estado(estado_data: EstadoCreateModel):
    if estados.update_estado(estado_data.dict()):
        return {"message": "Estado actualizado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Estado no encontrado")


# Api de la tabla para listar los estados
@app.get("/lista_Estado/{estado_id}")
def obtener_Estado(estado_id: int):
    estado_data = lista_estados.leer_Estado(estado_id)
    if estado_data:
        return estado_data
    else:
        raise HTTPException(status_code=404, detail="Estado no encontrado")

@app.get("/lista_Estado/")
def obtener_todos_los_Estados():
    return lista_estados.leer_Estados()  

# API TABLA CARGO
@app.post("/crear_cargo/")
def crear_cargo(cargo: CargoCreateModel):
    try:
        cargos.create_cargo(cargo.model_dump())
        return {"message": "Cargo creado exitosamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el cargo: {str(e)}")
    
@app.get("/cargo/{id}/")
def obtener_cargo(id: int):
    cargo = cargos.leer_cargo(id)
    if cargo:
        return cargo
    else:
        raise HTTPException(status_code=404, detail="Cargo no encontrado")
    
@app.get("/cargos/")
def obtener_todos_los_cargos():
    return cargos.leer_cargos()

@app.put("/actualizar_cargo/{id}")
def actualizar_cargo(id: int, cargo: CargoCreateModel):
    updated_data = cargo.model_dump()
    updated_data["id_cargo"] = id
    if cargos.update_cargo(updated_data):
        return {"message": "Cargo actualizado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Cargo no encontrado")

@app.delete("/eliminar_cargo/{id}/")
def eliminar_cargo(id: int):
    if cargos.delete_cargo(id):
        return {"message": "Cargo eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

#API TABLA COMENTARIO
@app.post("/crear_comentario/")
def crear_comentario(comentario: ComentarioCreateModel):
    try:
        comentario_db.create_comentario(comentario)
        return {"message": "Comentario creado exitosamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el comentario: {str(e)}")

@app.get("/comentario/{id}/")
def obtener_comentario(id: int):
    comentario = comentario_db.read_comentario(id)
    if comentario:
        return comentario
    else:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

@app.get("/comentario_estado/{id}/")
def obtener_comentario(id: int):
    comentario = comentario_db.read_comentario_estado(id)
    if comentario:
        return comentario
    else:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

@app.get("/comentarios/proyecto/{proyecto_id}")
def get_comentarios_por_proyecto(proyecto_id: int):
    comentarios = comentario_db.read_comentarios_por_proyecto(proyecto_id)
    if comentarios is None:
        raise HTTPException(status_code=404, detail="Comentarios no encontrados")
    return comentarios

@app.get("/comentarios/")
def obtener_todos_los_comentarios():
    return comentario_db.read_all_comentarios()

@app.put("/actualizar_comentario/{id}")
def actualizar_comentario(id: int, comentario: ComentarioCreateModel, current_user: UsuarioCreateModel = Depends(get_current_active_user)):
    updated_data = comentario
    updated_data.ID_Estado = current_user.ID_Estado
    if comentario_db.update_comentario(id, updated_data):
        return {"message": "Comentario actualizado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

@app.delete("/eliminar_comentario/{id}/")
def eliminar_comentario(id: int):
    if comentario_db.delete_comentario(id):
        return {"message": "Comentario eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

# API LIDER
@app.post("/crear_lider/")
def crear_lider(lider: LiderCreateModel):
    print(lider)
    try:
        lider_id = lider_db.create_lider(lider)
        return {"message": "Líder creado exitosamente", "id": lider_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el líder: {str(e)}")

@app.get("/lider/{lider_id}")
def obtener_lider(lider_id: int):
    lider_data = lider_db.read_lider(lider_id)
    if lider_data is None:
        raise HTTPException(status_code=404, detail="lideres no encontrados")
    return lider_data
    

@app.get("/lider_usuario/{id_usuario}/{id_proyecto}")
def obtener_lider_by_user(id_usuario: int, id_proyecto: int):
    lider_data = lider_db.read_lider_by_user(id_usuario, id_proyecto)
    if not lider_data:
        raise HTTPException(status_code=404, detail="Líder no encontrado para este usuario y proyecto")
    return lider_data


@app.get("/lideres/")
def obtener_todos_los_lideres():
    return lider_db.read_all_lideres()

@app.put("/actualizar_lider/{lider_id}")
def actualizar_lider(lider_id: int, lider: LiderCreateModel):
    try:
        lider_db.update_lider(lider_id, lider)
        return {"message": "Líder actualizado correctamente"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el líder: {str(e)}")

@app.delete("/eliminar_lider/{id_usuario}/{id_proyecto}")
def eliminar_lider(id_usuario : int, id_proyecto : int):
    if lider_db.delete_lider(id_usuario, id_proyecto):
        return {"message": "Líder y datos relacionados borrados correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Líder no encontrado")

# API ASIGNACION DE PROYECTOS(revisar si se esta usando)
@app.post("/crear_asignacion/")
def crear_asignacion(asignacion: ProyectoAsignadoCreateModel):
    try:
        asignacion_id = asignaciones.create_asignacion(asignacion)
        return {"message": "Asignacion creada exitosamente", "id": asignacion_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la asignacion: {str(e)}")

@app.get("/asignacion/{asignacion_id}")
def obtener_asignacion(asignacion_id: int):
    asignacion_data = asignaciones.read_asignacion(asignacion_id)
    if asignacion_data:
        return asignacion_data
    else:
        raise HTTPException(status_code=404, detail="asignacion no encontrada")

@app.get("/asignaciones/")
def obtener_todos_las_asignaciones():
    return asignaciones.read_all_asignaciones()

@app.delete("/eliminar_asignacion/{asignacion_id}")
def eliminar_asignacion(asignacion_id: int):
    if asignaciones.delete_Asignacion(asignacion_id):
        return {"message": "asignacion eliminada correctamente"}
    else:
        raise HTTPException(status_code=404, detail="asignacion no encontrada")

#api grupo lideres
@app.post("/crear_grupo/")
def crear_grupo(grupo: GrupoAsignadoCreateModel):
    try:
        grupo_id = Grupo.create_grupo(grupo)
        return {"message": "grupo creado exitosamente", "id": grupo_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el grupo: {str(e)}")
    


@app.get("/grupo/{id_grupo}")
def obtener_un_grupo(id_grupo : int):
    grupo_data = Grupo.ver_un_grupo(id_grupo)
    if grupo_data:
        return grupo_data
    else:
        raise HTTPException(status_code=404, detail="grupo no encontrada")
    
@app.get("/grupos_lider/{id_lider}")
def obtener_grupos_Lider(id_lider : int):
    grupos_data = Grupo.ver_grupos_de_Lider(id_lider)
    if grupos_data:
        return grupos_data
    else:
        raise HTTPException(status_code=404, detail="grupos no encontrados")

@app.get("/grupos/")
def obtener_todos_los_grupos():
    return Grupo.Ver_grupos()

#Api para los yeam_members
@app.post("/crear_miembro/")
def crear_miembro(data_miembro: TeamMemberCreateModel):
    try:
        miembro_id = miembro.create_TeamMember(data_miembro)
        return {"message": "miembro creado exitosamente", "id": miembro_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el miembro: {str(e)}")
    


@app.get("/miembro/{id_miembro}")
def obtener_un_miembro(id_miembro : int):
    miembro_data = miembro.ver_un_teamMember(id_miembro)
    if miembro_data:
        return miembro_data
    else:
        raise HTTPException(status_code=404, detail="teamMember no encontrada")

@app.get("/miembrosGrupo/{id_grupo}")
def obtener_miembros_gp(id_grupo : int):
    miembros_data = miembro.ver_teamMembers_por_grupo(id_grupo)
    if miembros_data:
        return miembros_data
    else:
        return None

@app.get("/miembros/")
def obtener_todos_los_miembros():
    return miembro.ver_teamMembers()

@app.delete("/eliminar_miembro/{id_usuario}/{id_proyecto}")
def eliminar_miembro(id_usuario : int, id_proyecto : int):
    if miembro.delete_team_member(id_usuario, id_proyecto):
        return {"message": "Miembro eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")


