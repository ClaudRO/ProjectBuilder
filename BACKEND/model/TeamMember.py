import psycopg2
from config.user_connection import UserConnection
from Schemas.SchemaTeamMember import TeamMemberCreateModel

from .security_auth import get_password_hash

class TeamMember:
    tabla = "team_member"
    def __init__(self, db_conn: UserConnection):
        self.db_conn = db_conn

    def create_TeamMember(self, teamMember_data : TeamMemberCreateModel ):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO team_member 
                    (id_rol, id_usuario, id_grupo)
                    VALUES (
                    %(id_rol)s,
                    %(id_usuario)s,
                    %(id_grupo)s)
                """, teamMember_data.dict())
                self.db_conn.conn.commit()
        except psycopg2.Error as e:
            print("Error al insertar el team_member:", e)
            self.db_conn.conn.rollback()

    def ver_un_teamMember(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM team_member WHERE id_miembro = %s
                """, (id,))
                return cur.fetchone()
        except psycopg2.Error as e:
            print("Error al recuperar la informacion del team_member:", e)
            self.db_conn.conn.rollback()
            
    def ver_teamMembers_por_grupo(self, id):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    SELECT id_usuario FROM team_member WHERE id_grupo = %s
                """, (id,))
                result = cur.fetchall()
                if not result:
                    return []  # Retornar una lista vacía si no se encuentran miembros
                return result
        except psycopg2.Error as e:
            print("Error al recuperar los miembros del grupo:", e)
            self.db_conn.conn.rollback()
            return []
            
    def ver_teamMembers(self):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("SELECT * FROM team_member")
                data = cur.fetchall()
                return data
        except psycopg2.Error as e:
            print("Error al obtener todos los team_members:", e)
            return []

   
    def delete_team_member(self, id_usuario, id_proyecto):
        try:
            with self.db_conn.conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM team_member
                    WHERE id_usuario = %s AND id_grupo = %s
                """, (id_usuario,id_proyecto))
                self.db_conn.conn.commit()
                return True
        except psycopg2.Error as e:
            print("Error al eliminar el team_member:", e)
            self.db_conn.conn.rollback()
            return False
        