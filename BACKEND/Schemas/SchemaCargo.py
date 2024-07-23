from typing import Optional
from pydantic import BaseModel


class CargoCreateModel(BaseModel):
    id_cargo: Optional[int]
    Nombre: str
    Descripcion: str
    class Config:
        from_attributes = True