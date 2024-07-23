from typing import Optional
from pydantic import BaseModel
from datetime import date

class UsuarioCreateModel(BaseModel):
    ID_Usuario: int
    Rut: str
    Nombres: str
    Apellidos: str
    hashed_Contrasenia: str
    Sexo: bool
    Fecha_Nacimiento: date
    Cargo: int
    Especialidad: str
    Correo: str
    Telefono: str
    disabled: bool

    class Config:
        from_attributes = True
        
