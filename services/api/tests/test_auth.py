from datetime import datetime, timedelta, timezone

import jwt
from app.core.config import settings
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def make_token(**claims: str) -> str:
    payload = {
        "sub": "1",
        "email": "admin@example.com",
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        **claims,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def test_machine_requires_authentication():
    response = client.get("/api/v1/machines/1")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication required"}


def test_machine_rejects_invalid_token():
    response = client.get(
        "/api/v1/machines/1",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid or expired token"}


def test_machine_accepts_valid_token():
    response = client.get(
        "/api/v1/machines/1",
        headers={"Authorization": f"Bearer {make_token()}"},
    )

    assert response.status_code != 401