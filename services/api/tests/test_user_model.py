from app.db.connection import get_connection


def test_seeded_users_have_roles_and_password_hashes():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT users.email, users.password_hash, roles.role_name
                FROM Users AS users
                JOIN Roles AS roles ON roles.id = users.role_id
                WHERE users.email IN ('admin@example.com', 'user@example.com')
                ORDER BY users.email
                """
            )
            users = cursor.fetchall()

    assert len(users) == 2
    assert users[0][0] == "admin@example.com"
    assert users[0][2] == "admin"
    assert users[1][0] == "user@example.com"
    assert users[1][2] == "user"
    assert all(user[1].startswith("$argon2") for user in users)