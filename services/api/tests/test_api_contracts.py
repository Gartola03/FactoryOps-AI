from datetime import datetime, timedelta, timezone

import jwt
import pytest
from app.core.config import settings
from app.db.connection import get_connection
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
TEST_MACHINE_ID = 997
TEST_MACHINE_CODE = "CONTRACT-997"


def auth_headers(role: str = "admin") -> dict[str, str]:
    token = jwt.encode(
        {
            "sub": "1",
            "email": "admin@example.com",
            "role": role,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(autouse=True)
def clean_contract_machine():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM machines WHERE id = %s", (TEST_MACHINE_ID,))
        conn.commit()
    yield
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM machines WHERE id = %s", (TEST_MACHINE_ID,))
        conn.commit()


def create_contract_machine(status: str = "stopped") -> None:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO machines (id, machine_code, name, machine_type, status)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (TEST_MACHINE_ID, TEST_MACHINE_CODE, "Contract test machine", "Pump", status),
            )
        conn.commit()


def test_protected_machine_endpoints_require_a_bearer_token():
    response = client.get("/api/v1/machines/")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication required"}


def test_operator_can_record_maintenance_but_cannot_change_machine_state():
    create_contract_machine()

    maintenance = client.post(
        f"/api/v1/machines/{TEST_MACHINE_ID}/maintenance",
        headers=auth_headers("operator"),
        json={"description": "Inspected pump coupling."},
    )
    state_change = client.patch(
        f"/api/v1/machines/{TEST_MACHINE_ID}/state",
        headers=auth_headers("operator"),
        json={"action": "start"},
    )

    assert maintenance.status_code == 201
    assert maintenance.json()["status"] == "submitted"
    assert state_change.status_code == 403


def test_machine_contract_returns_expected_errors_for_missing_and_invalid_data():
    missing_machine = client.get("/api/v1/machines/996", headers=auth_headers())
    invalid_machine = client.post(
        "/api/v1/machines/",
        headers=auth_headers(),
        json={"machine_code": "", "name": "Invalid", "machine_type": "Pump"},
    )

    assert missing_machine.status_code == 404
    assert missing_machine.json() == {"detail": "Machine not found"}
    assert invalid_machine.status_code == 422


def test_invalid_state_transition_returns_conflict():
    create_contract_machine("stopped")

    response = client.patch(
        f"/api/v1/machines/{TEST_MACHINE_ID}/state",
        headers=auth_headers("supervisor"),
        json={"action": "pause"},
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Cannot pause a stopped machine"}


def test_duplicate_machine_code_returns_conflict():
    create_contract_machine()

    response = client.post(
        "/api/v1/machines/",
        headers=auth_headers(),
        json={
            "machine_code": TEST_MACHINE_CODE,
            "name": "Duplicate",
            "machine_type": "Pump",
        },
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Machine code already exists"}
