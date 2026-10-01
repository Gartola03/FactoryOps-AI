from datetime import datetime, timedelta, timezone

import jwt
from app.core.config import settings
from app.db.connection import get_connection
from fastapi import APIRouter, HTTPException, status
from pwdlib import PasswordHash
from pwdlib.exceptions import UnknownHashError
from pydantic import BaseModel

router = APIRouter(prefix="/auth")
password_hash = PasswordHash.recommended()


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthenticatedUser(BaseModel):
    id: int
    username: str
    email: str
    role: str | None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: AuthenticatedUser


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT users.id, users.username, users.email, users.password_hash, roles.role_name
                FROM Users AS users
                LEFT JOIN Roles AS roles ON roles.id = users.role_id
                WHERE LOWER(users.email) = LOWER(%s)
                """,
                (credentials.email.strip(),),
            )
            user = cur.fetchone()

    if user is None or not _verify_password(credentials.password, user[3]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expiration_minutes)
    token = jwt.encode(
        {
            "sub": str(user[0]),
            "email": user[2],
            "role": user[4],
            "exp": expires_at,
        },
        settings.jwt_secret,
        algorithm="HS256",
    )

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=AuthenticatedUser(
            id=user[0],
            username=user[1],
            email=user[2],
            role=user[4],
        ),
    )


def _verify_password(password: str, stored_hash: str) -> bool:
    try:
        return password_hash.verify(password, stored_hash)
    except (TypeError, ValueError, UnknownHashError):
        return False