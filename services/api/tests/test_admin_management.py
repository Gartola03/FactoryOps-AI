from datetime import datetime, timedelta, timezone

import jwt
from app.core.config import settings
from app.db.connection import get_connection
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
TEST_EMAIL = "admin-crud-test@factoryops.ai"


def user_id_for(email: str) -> int:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM Users WHERE email = %s", (email,))
            row = cur.fetchone()
    assert row is not None
    return row[0]


def auth_headers(role: str, email: str) -> dict[str, str]:
    token = jwt.encode(
        {
            "sub": str(user_id_for(email)),
            "email": email,
            "role": role,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )
    return {"Authorization": f"Bearer {token}"}


def test_only_admin_can_manage_users():
    supervisor_headers = auth_headers("supervisor", "supervisor@example.com")
    response = client.get("/api/v1/admin/users", headers=supervisor_headers)
    assert response.status_code == 403


def test_admin_can_create_edit_and_deactivate_user():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Users WHERE email = %s", (TEST_EMAIL,))
        conn.commit()

    headers = auth_headers("admin", "admin@example.com")
    try:
        create_response = client.post(
            "/api/v1/admin/users",
            headers=headers,
            json={
                "username": "Admin CRUD Test",
                "email": TEST_EMAIL,
                "password": "test-password-123",
                "role": "operator",
                "is_active": True,
            },
        )
        assert create_response.status_code == 201
        user_id = create_response.json()["id"]

        update_response = client.put(
            f"/api/v1/admin/users/{user_id}",
            headers=headers,
            json={
                "username": "Admin CRUD Supervisor",
                "email": TEST_EMAIL,
                "role": "supervisor",
                "is_active": False,
            },
        )
        assert update_response.status_code == 200
        assert update_response.json()["role"] == "supervisor"
        assert update_response.json()["is_active"] is False
    finally:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM Users WHERE email = %s", (TEST_EMAIL,))
            conn.commit()
