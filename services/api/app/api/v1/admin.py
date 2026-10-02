from typing import Any

from app.core.security import get_current_user, require_permission
from app.db.connection import get_connection
from fastapi import APIRouter, Depends, HTTPException
from pwdlib import PasswordHash
from pydantic import BaseModel, Field

router = APIRouter(prefix="/admin")
password_hash = PasswordHash.recommended()


class RoleUpdate(BaseModel):
    role: str = Field(pattern="^(admin|supervisor|operator)$")


class RolePermissionsUpdate(BaseModel):
    permissions: list[str]


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    email: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8)
    role: str = Field(pattern="^(admin|supervisor|operator)$")
    is_active: bool = True


class UserUpdate(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    email: str = Field(min_length=3, max_length=100)
    password: str | None = Field(default=None, min_length=8)
    role: str = Field(pattern="^(admin|supervisor|operator)$")
    is_active: bool = True


class FactoryConfigUpdate(BaseModel):
    value: str = Field(min_length=1)


@router.get("/users", dependencies=[Depends(require_permission("manage_users"))])
def list_users() -> list[dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                  SELECT users.id, users.username, users.email, roles.role_name,
                      users.is_active, users.last_login_at, users.created_at
                FROM Users AS users
                LEFT JOIN Roles AS roles ON roles.id = users.role_id
                ORDER BY users.id
                """
            )
            return [
                {"id": row[0], "username": row[1], "email": row[2], "role": row[3],
                 "is_active": row[4], "last_login_at": row[5], "created_at": row[6]}
                for row in cur.fetchall()
            ]


@router.post("/users", status_code=201, dependencies=[Depends(require_permission("manage_users"))])
def create_user(user: UserCreate) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(
                    """
                    INSERT INTO Users (username, email, password_hash, role_id, is_active)
                    VALUES (%s, %s, %s, (SELECT id FROM Roles WHERE role_name = %s), %s)
                    RETURNING id, username, email, is_active, created_at
                    """,
                    (user.username, user.email, password_hash.hash(user.password), user.role, user.is_active),
                )
            except Exception as error:
                if "unique" in str(error).lower():
                    raise HTTPException(status_code=409, detail="Username or email already exists") from error
                raise
            row = cur.fetchone()
    return {"id": row[0], "username": row[1], "email": row[2], "role": user.role,
            "is_active": row[3], "last_login_at": None, "created_at": row[4]}


@router.put("/users/{user_id}", dependencies=[Depends(require_permission("manage_users"))])
def edit_user(user_id: int, user: UserUpdate) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                if user.password:
                    cur.execute(
                        """
                        UPDATE Users SET username = %s, email = %s, password_hash = %s,
                            role_id = (SELECT id FROM Roles WHERE role_name = %s), is_active = %s
                        WHERE id = %s
                        RETURNING id, username, email, is_active, last_login_at, created_at
                        """,
                        (user.username, user.email, password_hash.hash(user.password), user.role, user.is_active, user_id),
                    )
                else:
                    cur.execute(
                        """
                        UPDATE Users SET username = %s, email = %s,
                            role_id = (SELECT id FROM Roles WHERE role_name = %s), is_active = %s
                        WHERE id = %s
                        RETURNING id, username, email, is_active, last_login_at, created_at
                        """,
                        (user.username, user.email, user.role, user.is_active, user_id),
                    )
            except Exception as error:
                if "unique" in str(error).lower():
                    raise HTTPException(status_code=409, detail="Username or email already exists") from error
                raise
            row = cur.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="User not found")
    return {"id": row[0], "username": row[1], "email": row[2], "role": user.role,
            "is_active": row[3], "last_login_at": row[4], "created_at": row[5]}


@router.patch("/users/{user_id}/role", dependencies=[Depends(require_permission("manage_users"))])
def update_user_role(user_id: int, update: RoleUpdate) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE Users SET role_id = (SELECT id FROM Roles WHERE role_name = %s)
                WHERE id = %s
                RETURNING id, username, email
                """,
                (update.role, user_id),
            )
            user = cur.fetchone()
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")
    return {"id": user[0], "username": user[1], "email": user[2], "role": update.role}


@router.get("/roles", dependencies=[Depends(require_permission("manage_roles"))])
def list_roles() -> list[dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT roles.role_name, COALESCE(array_agg(permissions.permission_name)
                       FILTER (WHERE permissions.permission_name IS NOT NULL), '{}')
                FROM Roles AS roles
                LEFT JOIN RolePermissions AS role_permissions ON role_permissions.role_id = roles.id
                LEFT JOIN Permissions AS permissions ON permissions.id = role_permissions.permission_id
                GROUP BY roles.role_name ORDER BY roles.role_name
                """
            )
            return [{"role": row[0], "permissions": row[1]} for row in cur.fetchall()]


@router.put("/roles/{role}/permissions", dependencies=[Depends(require_permission("manage_roles"))])
def update_role_permissions(role: str, update: RolePermissionsUpdate) -> dict[str, Any]:
    if role not in {"admin", "supervisor", "operator"}:
        raise HTTPException(status_code=404, detail="Role not found")
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM Roles WHERE role_name = %s", (role,))
            role_row = cur.fetchone()
            if role_row is None:
                raise HTTPException(status_code=404, detail="Role not found")
            cur.execute("SELECT permission_name FROM Permissions WHERE permission_name = ANY(%s)", (update.permissions,))
            valid_permissions = {row[0] for row in cur.fetchall()}
            if valid_permissions != set(update.permissions):
                raise HTTPException(status_code=400, detail="Unknown permission supplied")
            cur.execute("DELETE FROM RolePermissions WHERE role_id = %s", (role_row[0],))
            for permission in update.permissions:
                cur.execute(
                    "INSERT INTO RolePermissions (role_id, permission_id) SELECT %s, id FROM Permissions WHERE permission_name = %s",
                    (role_row[0], permission),
                )
    return {"role": role, "permissions": update.permissions}


@router.get("/factory", dependencies=[Depends(require_permission("manage_factory_configuration"))])
def get_factory_configuration() -> list[dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT config_key, config_value, updated_at FROM factory_configuration ORDER BY config_key"
            )
            return [{"key": row[0], "value": row[1], "updated_at": row[2]} for row in cur.fetchall()]


@router.put("/factory/{config_key}", dependencies=[Depends(require_permission("manage_factory_configuration"))])
def update_factory_configuration(
    config_key: str,
    update: FactoryConfigUpdate,
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO factory_configuration (config_key, config_value, updated_by)
                VALUES (%s, %s, %s)
                ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value,
                    updated_by = EXCLUDED.updated_by, updated_at = CURRENT_TIMESTAMP
                RETURNING config_key, config_value, updated_at
                """,
                (config_key, update.value, int(user["sub"])),
            )
            row = cur.fetchone()
    return {"key": row[0], "value": row[1], "updated_at": row[2]}
