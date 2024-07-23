import psycopg2
from typing import Optional
from Schemas.SchemaProyecto import ProyectoCreateModel
from config.user_connection import UserConnection

class Proyecto:
    tabla = "proyecto"
  
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_proyecto(self, proyecto_data: ProyectoCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Proyecto 
                    (Nombre,
                    Descripcion,
                    Fecha_Inicio,
                    Fecha_Termino)
                    VALUES (%(Nombre)s,
                    %(Descripcion)s,
                    %(Fecha_Inicio)s,
                    %(Fecha_Termino)s)
                    RETURNING ID_Proyecto
                """, proyecto_data.dict())
                proyecto_id = cur.fetchone()[0]
                self.db_conn.conn.commit()
                return proyecto_id
        except psycopg2.Error as e:
            print("Error al insertar el proyecto:", e)
            self.db_conn.conn.rollback()
            return None

    def read_proyecto(self, proyecto_id):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Proyecto WHERE ID_Proyecto = %s
            """, (proyecto_id,))
            return cur.fetchone()

    def read_all_proyectos(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Proyecto")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los proyectos:", e)
            return []

    def update_proyecto(self, updated_data):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE Proyecto
                    SET Nombre = %(Nombre)s,
                        Descripcion = %(Descripcion)s,
                        Fecha_Inicio = %(Fecha_Inicio)s,
                        Fecha_Termino = %(Fecha_Termino)s
                    WHERE ID_Proyecto = %(ID_Proyecto)s
                """, updated_data)
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al actualizar el proyecto:", e)
            self.db_conn.conn.rollback()
            return False


    def delete_proyecto(self, proyecto_id):
        try:
            with self.db_conn.conn.cursor() as cur:
                # Eliminar estados asociados al proyecto
                cur.execute("""
                    DELETE FROM estado
                    WHERE proyecto_id_proyecto = %s
                """, (proyecto_id,))

                # Obtener los IDs de los líderes asociados al proyecto
                cur.execute("""
                    SELECT id_lider
                    FROM lider_proyecto
                    WHERE id_proyecto = %s
                """, (proyecto_id,))
                lider_ids = cur.fetchall()

                for (lider_id,) in lider_ids:
                    # Eliminar miembros del equipo asociados a los grupos de cada líder
                    cur.execute("""
                        DELETE FROM team_member
                        WHERE id_grupo IN (
                            SELECT id_grupo
                            FROM gp_asignado
                            WHERE lider_id_lider = %s
                        )
                    """, (lider_id,))

                    # Eliminar grupos asociados a cada líder
                    cur.execute("""
                        DELETE FROM gp_asignado
                        WHERE lider_id_lider = %s
                    """, (lider_id,))

                # Eliminar líderes asociados al proyecto
                cur.execute("""
                    DELETE FROM lider_proyecto
                    WHERE id_proyecto = %s
                """, (proyecto_id,))

                # Finalmente, eliminar el proyecto
                cur.execute("""
                    DELETE FROM proyecto
                    WHERE id_proyecto = %s
                """, (proyecto_id,))

                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el proyecto y los datos relacionados:", e)
            self.db_conn.conn.rollback()
            return False
    
    def delete_all_proyectos(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                # Eliminar comentarios asociados a los estados de los proyectos
                cur.execute("""
                    DELETE FROM comentario
                    WHERE estado_id_estado IN (
                        SELECT id_estado FROM estado
                        WHERE proyecto_id_proyecto IN (SELECT id_proyecto FROM proyecto)
                    )
                """)

                # Eliminar todos los estados asociados a proyectos
                cur.execute("""
                    DELETE FROM estado
                    WHERE proyecto_id_proyecto IN (SELECT id_proyecto FROM proyecto)
                """)

                # Obtener los IDs de todos los líderes asociados a proyectos
                cur.execute("""
                    SELECT id_lider
                    FROM lider_proyecto
                    WHERE id_proyecto IN (SELECT id_proyecto FROM proyecto)
                """)
                lider_ids = cur.fetchall()

                for (lider_id,) in lider_ids:
                    # Eliminar miembros del equipo asociados a los grupos de cada líder
                    cur.execute("""
                        DELETE FROM team_member
                        WHERE id_grupo IN (
                            SELECT id_grupo
                            FROM gp_asignado
                            WHERE lider_id_lider = %s
                        )
                    """, (lider_id,))

                    # Eliminar grupos asociados a cada líder
                    cur.execute("""
                        DELETE FROM gp_asignado
                        WHERE lider_id_lider = %s
                    """, (lider_id,))

                # Eliminar todos los líderes asociados a proyectos
                cur.execute("""
                    DELETE FROM lider_proyecto
                    WHERE id_proyecto IN (SELECT id_proyecto FROM proyecto)
                """)

                # Eliminar todos los registros de en_proyecto
                cur.execute("""
                    DELETE FROM en_proyecto
                    WHERE id_proyecto IN (SELECT id_proyecto FROM proyecto)
                """)

                # Finalmente, eliminar todos los proyectos
                cur.execute("""
                    DELETE FROM proyecto
                """)

                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar todos los proyectos y los datos relacionados:", e)
            self.db_conn.conn.rollback()
            return False
