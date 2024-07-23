from typing import Optional
from pydantic import BaseModel


class ClienteAsignadoCreateModel(BaseModel):
   
    ID_Onproyect: Optional[int]
    Area: str
    id_proyecto: int
    id_cliente: int

    
    class Config:
        from_attributes = True