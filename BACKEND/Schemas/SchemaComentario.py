from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ComentarioCreateModel(BaseModel):

    ID_Comentario: int
    Descripcion: str
    Fecha: datetime
    estado_id_estado: int
    
    class Config:
        from_attributes = True
