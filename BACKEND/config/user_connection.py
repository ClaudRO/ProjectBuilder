import psycopg2
from fastapi import FastAPI

app = FastAPI()

class UserConnection:
    def __init__(self):
        self.conn = None
        try:
            self.conn = psycopg2.connect(
                dbname="BD_asigproyecto2", 
                user="postgres", 
                password="admin",
                host="localhost",
                port="5432"
            )
            print("Conexión exitosa a la base de datos.")
        except psycopg2.OperationalError as err:
            print("Error de conexión:", err)
            if self.conn:
                self.conn.close()

    def close_connection(self):
        if self.conn:
            self.conn.close()

# Si se ejecuta como script principal, iniciar el servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
