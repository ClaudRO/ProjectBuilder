from pydantic import BaseModel


class TeamMemberCreateModel(BaseModel):
    id_miembro: int
    id_rol: int
    id_usuario: int
    id_grupo: int

    class Config:
        from_attributes = True
