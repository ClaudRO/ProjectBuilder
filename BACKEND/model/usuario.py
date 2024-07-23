import psycopg2
from typing import Optional
from Schemas.SchemaUsuario import UsuarioCreateModel  # Es preferible utilizar snake_case para los nombres de los archivos y módulos
from config.user_connection import UserConnection
from .security_auth import get_password_hash

class Usuarios:
    tabla = "usuario"
   
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_usuario(self, data):
        try:
            data['hashed_Contrasenia'] = get_password_hash(data['hashed_Contrasenia'])
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Usuario (Rut, Nombres, Apellidos, hashed_Contrasenia, Sexo, Fecha_Nacimiento, Cargo, Especialidad, Correo, Telefono, disabled)
                    VALUES (%(Rut)s, %(Nombres)s, %(Apellidos)s, %(hashed_Contrasenia)s, %(Sexo)s, %(Fecha_Nacimiento)s, %(Cargo)s, %(Especialidad)s, %(Correo)s, %(Telefono)s, %(disabled)s)
                """, data)
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el usuario:", e)
            self.db_conn.conn.rollback()

    def read_filter(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM Usuario WHERE ID_Usuario = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar el usuario:", e)
            self.db_conn.conn.rollback()
    def read_all(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Usuario")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los usuarios:", e)
            return []

    def update_usuario(self, updated_data):

        try:
            updated_data['hashed_Contrasenia'] = get_password_hash(updated_data['hashed_Contrasenia'])
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE Usuario
                    SET Rut = %(Rut)s,
                        Nombres = %(Nombres)s,
                        Apellidos = %(Apellidos)s,
                        Hashed_Contrasenia = %(hashed_Contrasenia)s,
                        Sexo = %(Sexo)s,
                        Fecha_Nacimiento = %(Fecha_Nacimiento)s,
                        Cargo = %(Cargo)s,
                        Especialidad = %(Especialidad)s,
                        Correo = %(Correo)s,
                        Telefono = %(Telefono)s,
                        disabled = %(disabled)s
                    WHERE id_usuario = %(ID_Usuario)s
                """, updated_data)
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al actualizar el usuario:", e)
            self.db_conn.conn.rollback()
            return False


    def delete_usuario(self, rut):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM Usuario
                    WHERE Rut = %s
                """, (rut,))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el usuario:", e)
            self.db_conn.conn.rollback()
            return False
        
        
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