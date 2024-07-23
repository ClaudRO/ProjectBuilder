import psycopg2
from typing import Optional
from Schemas.SchemaCliente import ClienteCreateModel
from config.user_connection import UserConnection


class Cliente:
    tabla = "cliente"
  
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_cliente(self, cliente_data: ClienteCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Cliente (Nombre, Correo, Direccion, Descripcion, Numero, Razon_Social)
                    VALUES (%(Cli_Nombre)s, %(Cli_Correo)s, %(Cli_Direccion)s, %(Cli_Descripcion)s, %(Cli_Numero)s, %(Razon_Social)s)
                """, cliente_data.dict())
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el cliente:", e)
            self.db_conn.conn.rollback()


    def read_cliente(self, cliente_id):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Cliente WHERE ID_Cliente = %s
            """, (cliente_id,))
            return cur.fetchone()

    def read_all_clientes(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Cliente")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los clientes:", e)
            return []

    def update_cliente(self, cliente_id, updated_data: ClienteCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE Cliente
                    SET Nombre_Cliente = %(Nombre_Cliente)s,
                        Correo_Cliente = %(Correo_Cliente)s,
                        Direccion_Cliente = %(Direccion_Cliente)s,
                        Descripcion_Cliente = %(Descripcion_Cliente)s,
                        Numero_Cliente = %(Numero_Cliente)s,
                        Razon_Social = %(Razon_Social)s
                    WHERE ID_Cliente = %(cliente_id)s
                """, {**updated_data.dict(), "cliente_id": cliente_id})
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al actualizar el cliente:", e)
            self.db_conn.conn.rollback()
            raise


    def delete_cliente(self, cliente_id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM Cliente
                    WHERE ID_Cliente = %s
                """, (cliente_id,))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el cliente:", e)
            self.db_conn.conn.rollback()
            return False
