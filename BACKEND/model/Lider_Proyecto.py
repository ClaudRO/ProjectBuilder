import psycopg2
from typing import Optional
from Schemas.SchemaLider_Proyecto import LiderCreateModel
from config.user_connection import UserConnection

class Lider:
    tabla = "Lider"

    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_lider(self, lider_data: LiderCreateModel):
        
        try:
            
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Lider_Proyecto (ID_Proyecto, ID_Area, ID_Usuario)
                    VALUES (%(ID_Proyecto)s, %(ID_Area)s, %(ID_Usuario)s)
                    RETURNING ID_Lider
                """, lider_data.dict())
                lider_id = cur.fetchone()[0]
                self.db_conn.conn.commit()
                return lider_id
        except psycopg2.Error as e:
            print("Error al insertar el líder:", e)
            self.db_conn.conn.rollback()
            raise

    def read_lider(self, lider_id):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Lider_Proyecto WHERE ID_Proyecto = %s
            """, (lider_id,))
            return cur.fetchall()
        
    def read_lider_by_user(self, lider_id, id_proyecto):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Lider_Proyecto 
                WHERE id_usuario = %s AND id_proyecto = %s
            """, (lider_id, id_proyecto))
            return cur.fetchall()

    def read_all_lideres(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Lider")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los líderes:", e)
            return []

    def update_lider(self, lider_id, updated_data):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE Lider
                    SET ID_Proyecto = %(ID_Proyecto)s,
                        ID_Area = %(ID_Area)s
                    WHERE ID_Lider = %(ID_Lider)s
                """, {"ID_Proyecto": updated_data.ID_Proyecto, "ID_Area": updated_data.ID_Area, "ID_Lider": lider_id})
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al actualizar el líder:", e)
            self.db_conn.conn.rollback()
            raise
    def delete_lider(self, id_usuario, id_proyecto):
        try:
            with self.db_conn.conn.cursor() as cur:
                # Eliminar miembros del equipo que pertenecen a los grupos del líder
                cur.execute("""
                    DELETE FROM team_member
                    WHERE id_grupo IN (
                        SELECT id_grupo
                        FROM gp_asignado
                        WHERE lider_id_lider = (
                            SELECT id_lider
                            FROM lider_proyecto
                            WHERE id_usuario = %s AND id_proyecto = %s
                        )
                    )
                """, (id_usuario, id_proyecto))

                # Eliminar los grupos asignados al líder
                cur.execute("""
                    DELETE FROM gp_asignado
                    WHERE lider_id_lider = (
                        SELECT id_lider
                        FROM lider_proyecto
                        WHERE id_usuario = %s AND id_proyecto = %s
                    )
                """, (id_usuario, id_proyecto))

                # Eliminar el líder del proyecto
                cur.execute("""
                    DELETE FROM lider_proyecto
                    WHERE id_usuario = %s AND id_proyecto = %s
                """, (id_usuario, id_proyecto))

                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el lider de proyecto y los datos relacionados:", e)
            self.db_conn.conn.rollback()
            return False

