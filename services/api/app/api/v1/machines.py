from app.core.security import get_current_user
from app.db.connection import get_connection
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/machines", dependencies=[Depends(get_current_user)])


@router.get("/{machine_id}")
def get_machine(machine_id: int):

    with get_connection() as conn:
        with conn.cursor() as cur:

            with open("app/sql/machines/get_by_id.sql") as file:
                query = file.read()

            cur.execute(query, (machine_id,))
            row = cur.fetchone()

    return row
