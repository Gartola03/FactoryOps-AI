from datetime import datetime, timedelta, timezone

import jwt
from app.core.config import settings
from app.db.connection import get_connection
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def auth_headers():
    token = jwt.encode(
        {
            "sub": "1",
            "email": "admin@example.com",
            "role": "admin",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )
    return {"Authorization": f"Bearer {token}"}


def test_get_machine():
    # Arrange: create the data needed by this test
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO machines (id, machine_code, name, machine_type, status)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE
                SET machine_code = EXCLUDED.machine_code,
                    name = EXCLUDED.name,
                    machine_type = EXCLUDED.machine_type,
                    status = EXCLUDED.status
                """,
                (999, "TEST-CNC", "TEST-CNC", "CNC", "running"),
            )
        conn.commit()

    # Act: call the API
    response = client.get("/api/v1/machines/999", headers=auth_headers())

    # Assert: verify the API returned the expected data
    assert response.status_code == 200

    data = response.json()

    assert data[0] == 999
    assert data[2] == "TEST-CNC"
    assert data[4] == "running"

    # Cleanup: remove the test data
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM machines WHERE id = %s",
                (999,),
            )
        conn.commit()
