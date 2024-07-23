from typing import Optional
from pydantic import BaseModel


class EstadosCreateModel(BaseModel):
    id_estados: Optional[int]
    Nombre: str
    Descripcion: str
    class Config:
        from_attributes = True