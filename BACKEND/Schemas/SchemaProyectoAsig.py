from pydantic import BaseModel


class ProyectoAsignadoCreateModel(BaseModel):
    ID_Asignacion: int
    ID_Proyecto: int
    ID_Usuario: int

    class Config:
        from_attributes = True
