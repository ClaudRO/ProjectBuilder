from typing import Optional
from pydantic import BaseModel


class GrupoAsignadoCreateModel(BaseModel):
   
    ID_Grupo: Optional[int]
    nombre: str
    descripcion: str
    lider_id_lider: int
    
    class Config:
        from_attributes = True