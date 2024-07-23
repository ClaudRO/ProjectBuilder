from pydantic import BaseModel
from datetime import datetime

class ClienteCreateModel(BaseModel):
    ID_Cliente : int
    Cli_Nombre : str
    Cli_Correo : str
    Cli_Direccion : str
    Cli_Descripcion : str
    Cli_Numero : int
    Razon_Social : str




