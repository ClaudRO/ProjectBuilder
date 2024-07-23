from pydantic import BaseModel
from datetime import datetime


class ProyectoCreateModel(BaseModel):
   
    Nombre: str
    Descripcion: str
    Fecha_Inicio: datetime
    Fecha_Termino: datetime

    class Config:
        from_attributes = True