import psycopg2
from typing import Optional
from Schemas.SchemaProyectoAsig import ProyectoAsignadoCreateModel
from config.user_connection import UserConnection

class ProyectoAsignado:
    tabla = "asig_proyecto"

    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_asignacion(self, asignacion_data: ProyectoAsignadoCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Asig_Proyecto (ID_Proyecto, ID_Usuario)
                    VALUES (%(ID_Proyecto)s , %(ID_Usuario)s)
                    RETURNING ID_Asignacion
                """, asignacion_data.dict())
                asignacion_id = cur.fetchone()[0]
                self.db_conn.conn.commit()
                return asignacion_id
        except psycopg2.Error as e:
            print("Error al insertar el registro de asignacion de proyecto:", e)
            self.db_conn.conn.rollback()
            raise

    def read_asignacion(self, asignacion_id):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Asig_Proyecto WHERE ID_Asignacion = %s
            """, (asignacion_id,))
            return cur.fetchone()

    def read_all_asignaciones(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Asig_Proyecto")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos registros de asignaciones:", e)
            return []


    def delete_Asignacion(self, asignacion_id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM asig_Proyecto
                    WHERE ID_Asignacion = %s
                """, (asignacion_id,))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar la asignacion:", e)
            self.db_conn.conn.rollback()
            return False

