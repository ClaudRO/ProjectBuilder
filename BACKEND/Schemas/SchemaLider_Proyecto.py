from pydantic import BaseModel


class LiderCreateModel(BaseModel):
    ID_Lider: int
    ID_Proyecto: int
    ID_Area: int
    ID_Usuario: int

    class Config:
        from_attributes = True
