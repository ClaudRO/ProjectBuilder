import psycopg2
from config.user_connection import UserConnection
from .security_auth import get_password_hash

class Estados:
    tabla = "estados"
   
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn


    def leer_Estado(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM estados WHERE id_estados = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del estado:", e)
            self.db_conn.conn.rollback()
            
    def leer_Estados(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM estados")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los estados:", e)
            return []
