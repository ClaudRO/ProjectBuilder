from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from datetime import datetime, timedelta, timezone
from Schemas.SchemaUsuario import UsuarioCreateModel
import psycopg2 

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserInDB(UsuarioCreateModel):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)

####MUCGO CON LA SENTENCIA QUE SE OCUPA ACA, YA QUE SIEMPRE SE CONECTA ALA BASE DE DATOS DE LA SENTENCIA CONNECT, NO DEL USER_CONNECTION
#QUE UTILIZA LOS DEMAS MODULOS, POR ESO CUANDO SE CAMBIA LAS CRENDENCIUALES DE LA BD, SEGUI HACIENDO LA CONSULTA EN LA BD ANTIGUA, POR LO TANTO 
#HAY QUE IMPORTAR LA CONEXION, NO DEFINIRLA aca
def get_user(username: str):
    try:
        with psycopg2.connect(
            "dbname=BD_asigproyecto2 user=postgres password=admin host=localhost port=5432"
        ) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM usuario WHERE Correo = %s", (username,))
                user_data = cur.fetchone()
                if user_data:
                    user = UsuarioCreateModel(
                        ID_Usuario=user_data[0],
                        Rut=user_data[1],
                        Nombres=user_data[2],
                        Apellidos=user_data[3],
                        hashed_Contrasenia=user_data[4],
                        Correo=user_data[5],
                        Especialidad=user_data[6],
                        Cargo=user_data[7],
                        Fecha_Nacimiento=user_data[8],
                        Telefono=user_data[9],
                        disabled=user_data[10],
                        Sexo=user_data[11]
                    )
                    return user
    except psycopg2.Error as e:
        print("Error al obtener usuario de la base de datos:", e)
        return None

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if user and verify_password(password, user.hashed_Contrasenia):
        return user
    return None


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print("Token recibido:", token)  # Impresión de depuración
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        correo: str = payload.get("sub")
        print("correo recuperado con payload", correo)
        if correo is None:
            raise credentials_exception
        print("Correo extraído del token:", correo)  # Impresión de depuración
        token_data = TokenData(username=correo)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    print("Usuario obtenido de la base de datos:", user)  # Impresión de depuración
    return user



async def get_current_active_user(
    current_user: Annotated[UsuarioCreateModel, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user