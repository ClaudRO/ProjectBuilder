import psycopg2
from fastapi import HTTPException
from Schemas.SchemaComentario import ComentarioCreateModel
from config.user_connection import UserConnection

class Comentario:
    tabla = "Comentario"
  
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_comentario(self, comentario_data: ComentarioCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO Comentario (Descripcion, Fecha, estado_id_estado)
                    VALUES (%(Descripcion)s, %(Fecha)s, %(estado_id_estado)s)
                """, comentario_data.dict())
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el comentario:", e)
            self.db_conn.conn.rollback()
            raise

    def read_comentario(self, comentario_id):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Comentario WHERE ID_Comentario = %s
            """, (comentario_id,))
            return cur.fetchone()
        
    def read_comentario_estado(self, comentario_id):
        with self.db_conn.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Comentario WHERE estado_id_estado = %s
            """, (comentario_id,))
            return cur.fetchone()

    def read_all_comentarios(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM Comentario")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los comentarios:", e)
            return []

    def read_comentarios_por_proyecto(self, proyecto_id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT c.*
                    FROM Comentario c
                    JOIN Estado e ON c.estado_id_estado = e.id_estado
                    WHERE e.proyecto_id_proyecto = %s
                """, (proyecto_id,))
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener los comentarios por proyecto:", e)
            return []

    def update_comentario(self, comentario_id, updated_data: ComentarioCreateModel):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    UPDATE Comentario
                    SET Descripcion = %(Descripcion)s,
                        Fecha = %(Fecha)s,
                        ID_Estado = %(ID_Estado)s
                    WHERE ID_Comentario = %(comentario_id)s
                """, {**updated_data.dict(), "comentario_id": comentario_id})
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al actualizar el comentario:", e)
            self.db_conn.conn.rollback()
            raise

    def delete_comentario(self, comentario_id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM Comentario
                    WHERE ID_Comentario = %s
                """, (comentario_id,))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el comentario:", e)
            self.db_conn.conn.rollback()
            return False
