from datetime import date
from typing import Optional
from pydantic import BaseModel


class EstadoCreateModel(BaseModel):
    id_estado: Optional[int]
    proyecto_id_proyecto: Optional[int]
    estados_id_estados: Optional[int]
    Fecha:  Optional[date]
    actual:bool
    class Config:
        from_attributes = True