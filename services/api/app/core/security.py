from typing import Any

import jwt
from app.core.config import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError

bearer_scheme = HTTPBearer(auto_error=False)

ROLE_PERMISSIONS = {
    "operator": {
        "view_machines",
        "view_telemetry",
        "view_alerts",
        "view_predictions",
        "view_maintenance_history",
        "investigate_machines",
        "use_copilot",
        "record_maintenance",
    },
    "supervisor": {
        "view_machines",
        "view_telemetry",
        "view_alerts",
        "view_predictions",
        "view_maintenance_history",
        "investigate_machines",
        "use_copilot",
        "record_maintenance",
        "create_machines",
        "update_machines",
        "delete_machines",
        "start_machines",
        "stop_machines",
        "pause_machines",
        "resume_machines",
        "run_scenarios",
        "inject_failures",
        "reset_simulations",
        "review_shift_logs",
    },
    "admin": {"*"},
}


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict[str, Any]:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=["HS256"],
        )
    except InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    if not payload.get("sub") or not payload.get("email") or not payload.get("role"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


def require_permission(permission: str):
    def dependency(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        role = str(user.get("role", "")).strip().lower()
        permissions = ROLE_PERMISSIONS.get(role, set())
        if "*" not in permissions and permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission required: {permission}",
            )
        return user

    return dependency