import psycopg2
from config.user_connection import UserConnection
from .security_auth import get_password_hash

class Estado:
    tabla = "estado"
   
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_estado(self, data):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Estado 
                    (estados_id_estados,
                    proyecto_id_proyecto,
                    fecha,
                    actual)
                    VALUES (%(estados_id_estados)s,
                    %(proyecto_id_proyecto)s,
                    %(Fecha)s,
                    %(actual)s)
                """, data)
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el estado:", e)
            self.db_conn.conn.rollback()

    def leer_estado_proyecto(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM estado WHERE proyecto_id_proyecto = %s  AND actual = TRUE
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del estado:", e)
            self.db_conn.conn.rollback()
            
    def leer_estados(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM estado")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los estados:", e)
            return []

    def update_estado(self, updated_data):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE estado
                    SET actual = %(actual)s
                    WHERE id_estado = %(id_estado)s
                """, updated_data)
                print(updated_data)
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al actualizar el estado:", e)
            self.db_conn.conn.rollback()
            return False

    def delete_estado(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM estado
                    WHERE id_estado = %s
                """, (id,))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el estado:", e)
            self.db_conn.conn.rollback()
            return False