import psycopg2
from config.user_connection import UserConnection
from .security_auth import get_password_hash
from Schemas.SchemaClienteAsignado import ClienteAsignadoCreateModel


class en_proyecto:
    tabla = "en_proyecto"  
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_Asignacion_Cli(self, data: ClienteAsignadoCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO en_proyecto (area, id_proyecto, id_cliente)
                    VALUES (%(Area)s, %(id_proyecto)s, %(id_cliente)s)
                """, data.dict())
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el Asignacion_Cli:", e)
            self.db_conn.conn.rollback()
        
    
            

    def ver_un_Asignacion_Cli(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM en_proyecto WHERE id_onproject = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del Asignacion_Cli:", e)
            self.db_conn.conn.rollback()
    
    def ver_Asig_Cli_project(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM en_proyecto WHERE id_proyecto = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del Asignacion_Cli:", e)
            self.db_conn.conn.rollback()
            
    def Ver_Asignacion_Clis(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM en_proyecto")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los Asignacion_Clis:", e)
            return []
