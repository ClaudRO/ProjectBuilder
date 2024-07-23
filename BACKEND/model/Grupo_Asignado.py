import psycopg2
from config.user_connection import UserConnection
from .security_auth import get_password_hash

class Gp_asignado:
    tabla = "gp_asignado"
   
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_grupo(self, data):
        print(data)
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO gp_asignado (nombre, descripcion, lider_id_lider)
                    VALUES (%(nombre)s, %(descripcion)s, %(lider_id_lider)s)
                """, data.dict())
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el grupo:", e)
            self.db_conn.conn.rollback()
            

    def ver_un_grupo(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM gp_asignado WHERE id_grupo = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del grupo:", e)
            self.db_conn.conn.rollback()
    
    def ver_grupos_de_Lider(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM gp_asignado WHERE lider_id_lider = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del grupo:", e)
            self.db_conn.conn.rollback()
            
    def Ver_grupos(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM gp_asignado")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los grupos:", e)
            return []
