import psycopg2
from config.user_connection import UserConnection
from .security_auth import get_password_hash

class Cargos:
    tabla = "cargo"
   
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_cargo(self, data):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Cargo (Nombre, Descripcion)
                    VALUES (%(Nombre)s, %(Descripcion)s)
                """, data)
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el cargo:", e)
            self.db_conn.conn.rollback()

    def leer_cargo(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM Cargo WHERE id_cargo = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del cargo:", e)
            self.db_conn.conn.rollback()
            
    def leer_cargos(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Cargo")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los cargos:", e)
            return []

    def update_cargo(self, updated_data):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE Cargo
                    SET Nombre = %(Nombre)s,
                        Descripcion = %(Descripcion)s
                    WHERE id_cargo = %(id_cargo)s
                """, updated_data)
                print(updated_data)
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al actualizar el cargo:", e)
            self.db_conn.conn.rollback()
            return False

    def delete_cargo(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM Cargo
                    WHERE id_cargo = %s
                """, (id,))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el cargo:", e)
            self.db_conn.conn.rollback()
            return False