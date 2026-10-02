from datetime import datetime, timedelta, timezone

import jwt
import pytest
from app.core.config import settings
from app.db.connection import get_connection
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
TEST_MACHINE_ID = 998


def user_id_for(role: str) -> int:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM Users WHERE email = %s", (f"{role}@example.com",))
            row = cur.fetchone()
    assert row is not None
    return row[0]


def auth_headers(role: str) -> dict[str, str]:
    token = jwt.encode(
        {
            "sub": str(user_id_for(role)),
            "email": f"{role}@example.com",
            "role": role,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(autouse=True)
def clean_test_machine():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM machines WHERE id = %s", (TEST_MACHINE_ID,))
        conn.commit()
    yield
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM machines WHERE id = %s", (TEST_MACHINE_ID,))
        conn.commit()


def create_test_machine(status: str = "stopped"):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO machines (id, machine_code, name, machine_type, status)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (TEST_MACHINE_ID, "TEST-OPS", "Operations test machine", "CNC", status),
            )
        conn.commit()


def test_operator_can_list_and_read_machine_detail():
    create_test_machine()

    list_response = client.get("/api/v1/machines/", headers=auth_headers("operator"))
    detail_response = client.get(
        f"/api/v1/machines/{TEST_MACHINE_ID}/detail",
        headers=auth_headers("operator"),
    )

    assert list_response.status_code == 200
    assert any(machine["id"] == TEST_MACHINE_ID for machine in list_response.json())
    assert detail_response.status_code == 200
    assert detail_response.json()["machine"]["machine_code"] == "TEST-OPS"
    assert detail_response.json()["maintenance_history"] == []


def test_operator_cannot_create_or_run_scenarios():
    create_response = client.post(
        "/api/v1/machines/",
        headers=auth_headers("operator"),
        json={"machine_code": "OPERATOR-CREATE", "name": "Denied", "machine_type": "CNC"},
    )
    scenario_response = client.post(
        f"/api/v1/machines/{TEST_MACHINE_ID}/scenarios",
        headers=auth_headers("operator"),
        json={"scenario_name": "Bearing Failure", "action": "run"},
    )

    assert create_response.status_code == 403
    assert scenario_response.status_code == 403


def test_supervisor_can_create_and_transition_machine():
    create_response = client.post(
        "/api/v1/machines/",
        headers=auth_headers("supervisor"),
        json={"machine_code": "SUPERVISOR-CREATE", "name": "Created machine", "machine_type": "Pump"},
    )

    assert create_response.status_code == 201
    machine_id = create_response.json()["id"]
    try:
        start_response = client.patch(
            f"/api/v1/machines/{machine_id}/state",
            headers=auth_headers("supervisor"),
            json={"action": "start"},
        )
        pause_response = client.patch(
            f"/api/v1/machines/{machine_id}/state",
            headers=auth_headers("supervisor"),
            json={"action": "pause"},
        )
        resume_response = client.patch(
            f"/api/v1/machines/{machine_id}/state",
            headers=auth_headers("supervisor"),
            json={"action": "resume"},
        )
        stop_response = client.patch(
            f"/api/v1/machines/{machine_id}/state",
            headers=auth_headers("supervisor"),
            json={"action": "stop"},
        )

        assert start_response.json()["status"] == "running"
        assert pause_response.json()["status"] == "paused"
        assert resume_response.json()["status"] == "running"
        assert stop_response.json()["status"] == "stopped"
    finally:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM machines WHERE id = %s", (machine_id,))
            conn.commit()


def test_supervisor_can_update_and_delete_machine_operator_cannot():
    create_test_machine()

    operator_update = client.put(
        f"/api/v1/machines/{TEST_MACHINE_ID}",
        headers=auth_headers("operator"),
        json={"machine_code": "TEST-OPS", "name": "Denied update", "machine_type": "CNC", "factory_id": 1},
    )
    operator_delete = client.delete(
        f"/api/v1/machines/{TEST_MACHINE_ID}",
        headers=auth_headers("operator"),
    )
    supervisor_update = client.put(
        f"/api/v1/machines/{TEST_MACHINE_ID}",
        headers=auth_headers("supervisor"),
        json={"machine_code": "TEST-OPS-UPDATED", "name": "Updated machine", "machine_type": "Pump", "factory_id": 2},
    )
    supervisor_delete = client.delete(
        f"/api/v1/machines/{TEST_MACHINE_ID}",
        headers=auth_headers("supervisor"),
    )

    assert operator_update.status_code == 403
    assert operator_delete.status_code == 403
    assert supervisor_update.status_code == 200
    assert supervisor_update.json()["name"] == "Updated machine"
    assert supervisor_delete.status_code == 204


def test_operator_records_maintenance_and_supervisor_verifies_report():
    create_test_machine("failed")

    record_response = client.post(
        f"/api/v1/machines/{TEST_MACHINE_ID}/maintenance",
        headers=auth_headers("operator"),
        json={"description": "Drive-end bearing inspected and replaced."},
    )

    assert record_response.status_code == 201
    record_id = record_response.json()["id"]

    reports_response = client.get(
        "/api/v1/machines/shift-reports",
        headers=auth_headers("supervisor"),
    )
    verify_response = client.patch(
        f"/api/v1/machines/shift-reports/{record_id}/verify",
        headers=auth_headers("supervisor"),
    )

    assert reports_response.status_code == 200
    assert any(report["id"] == record_id for report in reports_response.json())
    assert verify_response.status_code == 200
    assert verify_response.json()["status"] == "verified"
