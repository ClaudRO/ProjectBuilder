from pydantic import BaseModel

class PrivilegioSchema(BaseModel):
    id_perfil: int
    nombre_perfil: str
    descripcion: str
    CREATE: bool
    PUT: bool
    DELETE: bool
    GET: bool
    class Config:
        from_attributes = True